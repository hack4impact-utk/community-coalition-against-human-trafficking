import InventoryItemSchema from 'server/models/InventoryItem'
import * as MongoDriver from 'server/actions/MongoDriver'
import { InventoryItem } from 'utils/types'
import { ApiError } from 'utils/types'
import { apiInventoryItemValidation } from 'utils/apiValidators'

/**
 * Finds all inventoryItems
 * @returns All inventoryItems
 */
export async function getInventoryItems() {
  // aggregate pipeline does the following:
  // looks up itemDefinition _id in inventoryItem
  // looks up categroy _id in itemDefinition
  // looks up attribute _ids in itemDefinition
  // looks up attribte _ids in inventoryItem
  // looks up user _ids in inventoryItem
  return await MongoDriver.getEntities(InventoryItemSchema, [
    {
      $lookup: {
        from: 'itemDefinitions',
        let: { itemDefinitions: '$itemDefinitions' },
        pipeline: [
          {
            $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $lookup: {
              from: 'attributes',
              localField: 'attributes',
              foreignField: '_id',
              as: 'attributes',
            },
          },
          {
            $set: {
              category: { $arrayElemAt: ['$category', 0] },
            },
          },
        ],
        localField: 'itemDefinition',
        foreignField: '_id',
        as: 'itemDefinition',
      },
    },
    {
      $lookup: {
        from: 'attributes',
        localField: 'attributes.attribute',
        foreignField: '_id',
        as: 'attributes',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'assignee',
        foreignField: '_id',
        as: 'assignee',
      },
    },
  ])
}

/**
 * Checks to see if an item is in the inventory and will add to the quantity or
 * create the item if needed.
 * @param item the item that will be added (checkedIn) to db
 * @param quantity of item to add
 */
export async function checkInInventoryItem(
  item: Partial<InventoryItem>,
  itemQuantity: number
) {
  if (itemQuantity < 1) {
    throw new ApiError(400, 'Check in quantity should be greater than 0')
  }
  item.attributes?.sort((a, b) => (a.attribute > b.attribute ? 1 : -1))

  const itemMatches = await MongoDriver.findEntities(InventoryItemSchema, item)
  if (itemMatches.length) {
    itemMatches[0].quantity += itemQuantity
    MongoDriver.updateEntity(
      InventoryItemSchema,
      itemMatches[0].id,
      itemMatches[0]
    )
  } else {
    item.quantity = itemQuantity
    apiInventoryItemValidation(item)
    MongoDriver.createEntity(InventoryItemSchema, item as InventoryItem)
  }
}

/**
 * Checks to see if an item is in the inventory and will remove an amount or
 * 400 error if it does not exist.
 * @param item the item that will be removed (checkOut) from db
 * @param quantity of item to remove
 * @throws ApiError: 400 when checking out an item would result a negative quantity in the db
 * @throws ApiError: 404 when attempting to check out an item that is not in the db
 */
export async function checkOutInventoryItem(
  item: Partial<InventoryItem>,
  quantityRemoved: number
) {
  item.attributes?.sort((a, b) => (a.attribute > b.attribute ? 1 : -1))
  if (quantityRemoved < 1) {
    throw new ApiError(400, 'Check out quantity should be greater than 0')
  }
  const itemMatches = await MongoDriver.findEntities(InventoryItemSchema, item)
  if (itemMatches.length) {
    const modifiedItemQuantity = (itemMatches[0].quantity -= quantityRemoved)
    if (modifiedItemQuantity < 0) {
      throw new ApiError(400, 'Check out would result in negative quantity.')
    } else {
      MongoDriver.updateEntity(
        InventoryItemSchema,
        itemMatches[0].id,
        itemMatches[0]
      )
    }
  } else {
    throw new ApiError(404, 'Entity does not exist')
  }
}
