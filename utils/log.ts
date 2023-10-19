import { Session } from 'next-auth'
import { setAssignee } from 'server/actions/InventoryItems'
import * as MongoDriver from 'server/actions/MongoDriver'
import UserSchema from 'server/models/User'
import ItemDefinitionSchema from 'server/models/ItemDefinition'
import { InventoryItemDocument } from 'server/models/InventoryItem'
import { Document } from 'mongoose'

/**
 * Logs when an assignee has been changed for an inventory item
 * @param actionUser The user assigning the inventory item
 * @param assigneeId The id of the user being assigned the inventory item
 * @param inventoryItem The inventory item
 * @returns Nothing
 */
export async function logAssignment(
  actionUser: Session['user'],
  assigneeId: string,
  inventoryItem: Awaited<ReturnType<typeof setAssignee>>
) {
  if (inventoryItem === null) {
    return
  }

  const itemDef = await MongoDriver.getEntity(
    ItemDefinitionSchema,
    inventoryItem.itemDefinition as string
  )
  if (assigneeId) {
    const assignee = await MongoDriver.getEntity(UserSchema, assigneeId)
    console.info(
      `${actionUser.name} has assigned "${itemDef.name}" (${inventoryItem._id}) to ${assignee.name}`
    )
  } else {
    console.info(
      `${actionUser.name} has cleared the assignment for "${itemDef.name}" (${inventoryItem._id})`
    )
  }
}

export async function logInventoryItemSoftDeletion(
  actionUser: Session['user'],
  inventoryItem: Awaited<
    ReturnType<typeof MongoDriver.softDeleteEntity<InventoryItemDocument>>
  >
) {
  const itemDef = await MongoDriver.getEntity(
    ItemDefinitionSchema,
    inventoryItem.itemDefinition as string
  )
  console.info(
    `${actionUser.name} has soft-deleted inventory item "${itemDef.name}" (${inventoryItem._id})`
  )
}

export async function logSoftDeletion<
  TSchema extends Document & { name: string }
>(
  actionUser: Session['user'],
  entity: Awaited<ReturnType<typeof MongoDriver.softDeleteEntity<TSchema>>>
) {
  console.info(
    `${actionUser.name} has soft-deleted "${entity.name}" (${entity._id}) from ${entity.collection.collectionName}`
  )
}
