import mongoDb from '../index'
import InventoryItemSchema from '../models/InventoryItem'


/**
 * Gets all Items from the database
 * @returns ALL items
 */
export async function getInventoryItems() {
  await mongoDb()
  return await InventoryItemSchema.find()
}


