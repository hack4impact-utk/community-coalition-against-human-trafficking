import InventoryItemSchema from 'server/models/InventoryItem'
import * as MongoDriver from 'server/actions/MongoDriver'
import { InventoryItem } from 'utils/types'
import { ApiError } from 'utils/types'

/**
 * Checks to see if an item is in the inventory and will add to the quantity or
 * create the item if needed.
 * @param item
 * @param quantity of item to add
 * @returns checksIn Items to the inventory
 */
export async function checkInInventoryItem(
  item: InventoryItem,
  quantityItem: number
) {
  const itemMatches = await MongoDriver.findEntities(InventoryItemSchema, item)
  if (itemMatches.length) {
    itemMatches[0].quantity += quantityItem
    MongoDriver.updateEntity(
      InventoryItemSchema,
      itemMatches[0].id,
      itemMatches[0]
    )
  } else {
    MongoDriver.createEntity(InventoryItemSchema, item)
  }
}

/**
 * Checks to see if an item is in the inventory and will remove an amount or
 * 400 error if it does not exist.
 * @param item
 * @param quantity of item to remove
 * @returns checksOut Items to the inventory
 */
export async function checkOutInventoryItem(
  item: InventoryItem,
  quantityRemoved: number
) {
  const itemMatches = await MongoDriver.findEntities(InventoryItemSchema, item)
  if (itemMatches.length) {
    itemMatches[0].quantity -= quantityRemoved
    MongoDriver.updateEntity(
      InventoryItemSchema,
      itemMatches[0].id,
      itemMatches[0]
    )
  } else {
    throw new ApiError(404, 'Entity does not exist')
  }
}
