import InventoryItemSchema from 'server/models/InventoryItem'
import * as MongoDriver from 'server/actions/MongoDriver'
import {
  InventoryItem,
  InventoryItemPostRequest,
  InventoryItemPutRequest,
} from 'utils/types'
import { ApiError } from 'utils/types'
import { apiInventoryItemValidation } from 'utils/apiValidators'
import { PipelineStage } from 'mongoose'
import { errors } from 'utils/constants/errors'
import deepCopy from 'utils/deepCopy'

// aggregate pipeline does the following:
// looks up itemDefinition _id in inventoryItem
// looks up categroy _id in itemDefinition
// looks up attribute _ids in itemDefinition
// looks up attribte _ids in inventoryItem
// looks up user _ids in inventoryItem
const requestPipeline: PipelineStage[] = [
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
  // itemDefinition was being returned as an array, so extract it from the array
  {
    $set: {
      itemDefinition: { $arrayElemAt: ['$itemDefinition', 0] },
    },
  },
  // creates a temporary array of attribute documents called 'attributeDocs' containing all relevant attribute documents
  {
    $lookup: {
      from: 'attributes',
      localField: 'attributes.attribute',
      foreignField: '_id',
      as: 'attributeDocs',
    },
  },
  // the above lookup only gets the attribute docs from the 'attributes' collection.
  // It does not generate the inventoryItem attribute/value pairs.
  {
    $addFields: {
      // builds out the inventoryItem.attributes array from scratch
      attributes: {
        // for every attribute in inventoryItem.attributes object, create an attribute/value pair
        $map: {
          input: '$attributes',
          as: 'attr', // attribute from the inventoryItem.attributes array
          in: {
            attribute: {
              // find the corresponding document from the attributes collection with the same _id
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$attributeDocs',
                    as: 'doc', // document from the attributes collection
                    cond: { $eq: ['$$doc._id', '$$attr.attribute'] },
                  },
                },
                0,
              ],
            },
            // set the inventoryItem.attributes[i].value to its original value
            value: '$$attr.value',
          },
        },
      },
    },
  },
  // delete the temporary array of attribute documents
  {
    $project: {
      attributeDocs: 0,
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
  {
    $set: {
      assignee: { $arrayElemAt: ['$assignee', 0] },
    },
  },
]

/**
 * Finds all inventoryItems
 * @returns All inventoryItems
 */
export async function getInventoryItems() {
  return await MongoDriver.getEntities(InventoryItemSchema, requestPipeline)
}

/**
 * Finds an itemDefinition by its id
 * @id The id of the InventoryItem object to find
 * @returns The InventoryItem with the given _id
 */
export async function getInventoryItem(id: string) {
  return await MongoDriver.getEntity(InventoryItemSchema, id, requestPipeline)
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
    item = deepCopy(itemMatches[0])
    apiInventoryItemValidation(item, 'PUT')
    MongoDriver.updateEntity(
      InventoryItemSchema,
      item._id as string,
      item as InventoryItemPutRequest
    )
  } else {
    item.quantity = itemQuantity
    apiInventoryItemValidation(item, 'POST')
    MongoDriver.createEntity(
      InventoryItemSchema,
      item as InventoryItemPostRequest
    )
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
      apiInventoryItemValidation(item, 'PUT')
      MongoDriver.updateEntity(
        InventoryItemSchema,
        itemMatches[0].id,
        itemMatches[0] as InventoryItemPutRequest
      )
    }
  } else {
    throw new ApiError(404, errors.notFound)
  }
}
