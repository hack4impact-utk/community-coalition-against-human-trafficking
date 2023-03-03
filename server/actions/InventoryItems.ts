import InventoryItemSchema from 'server/models/InventoryItem'
import * as MongoDriver from 'server/actions/MongoDriver'
import { InventoryItem } from 'utils/types'
import { ApiError } from 'utils/types'

/**
 * Checks to see if an item is in the inventory and will add to the quantity or
 * create the item if needed.
 * @param item the item that will be added (checkedIn) to db
 * @param quantity of item to add
 */
export async function checkInInventoryItem(
  item: InventoryItem,
  itemQuantity: number
) {
  const itemMatches = await MongoDriver.findEntities(InventoryItemSchema, item)
  if (itemMatches.length) {
    itemMatches[0].quantity += itemQuantity
    itemMatches[0].attributes?.sort()
    MongoDriver.updateEntity(
      InventoryItemSchema,
      itemMatches[0].id,
      itemMatches[0]
    )
  } else {
    item.attributes?.sort((a, b) => {
      if (typeof a.attribute === 'string' || typeof b.attribute === 'string') {
        return 0
      }
      if (a.attribute._id && b.attribute._id) {
        return a.attribute._id > b.attribute._id ? 1 : -1
      }
      return 0
    })
    item.quantity = itemQuantity
    MongoDriver.createEntity(InventoryItemSchema, item)
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
  item: InventoryItem,
  quantityRemoved: number
) {
  const itemMatches = await MongoDriver.findEntities(InventoryItemSchema, item)
  if (itemMatches.length) {
    const modifiedItemQuantity = (itemMatches[0].quantity -= quantityRemoved)
    if (modifiedItemQuantity < 0) {
      throw new ApiError(
        400,
        'Operation failed: Check out would result in negative quantity.'
      )
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
