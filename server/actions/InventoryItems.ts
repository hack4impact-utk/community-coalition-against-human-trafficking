import InventoryItemSchema from 'server/models/InventoryItem'
import * as MongoDriver from 'server/actions/MongoDriver'
import { InventoryItem } from 'utils/types'

/**
 * Checks to see if an item is in the inventory and will add to the quantity or
 * create the item if needed.
 * @param item
 * @param quantity of item
 * @returns checksIn Items to the inventory
 */
export async function checkInInventoryItem(
  item: InventoryItem,
  quantityItem: number
) {
  const matches = await MongoDriver.findEntities(InventoryItemSchema, item)
  console.log(matches)
  if (matches.length) {
    // add quantity
  } else {
    // create new item
  }
}

/**
 * Checks to see if an item is in the inventory and will remove an amount or
 * 400 error if it does not exist.
 * @param item
 * @param quantity of item to remove
 * @returns checksIn Items to the inventory
 */
// export async function checkOutInventoryItem(item: InventoryItem, quantityRemoved: number) {
//     if (MongoDriver.getEntities(item) = ) {// see what this returns when it finds something vs not
//             // add quantity
//     }
//     else {
//             // create new item
//     }
// }
