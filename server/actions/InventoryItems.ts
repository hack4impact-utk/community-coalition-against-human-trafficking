import InventoryItemSchema from 'server/models/InventoryItem'
import * as MongoDriver from 'server/actions/MongoDriver'
import {
  InventoryItem,
  InventoryItemPostRequest,
  InventoryItemPutRequest,
} from 'utils/types'
import { ApiError } from 'utils/types'
import { apiInventoryItemValidation } from 'utils/apiValidators'
import constants from 'utils/constants'

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
    apiInventoryItemValidation(item, 'PUT')
    MongoDriver.updateEntity(
      InventoryItemSchema,
      itemMatches[0].id,
      itemMatches[0] as InventoryItemPutRequest
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
    throw new ApiError(404, constants.errors.notFound)
  }
}
