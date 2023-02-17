import mongoDb from '../index'
import ItemDefinitionSchema from '../models/ItemDefinition'
import { ItemDefinition } from '../../utils/types'

/**
 * Creates a new ItemDefinition object in the database
 * @param itemDefinition The ItemDefinition object to create
 * @returns The newly created ItemDefinition object from the database
 */
export async function createItemDefinition(itemDefinition: ItemDefinition) {
  await mongoDb()
  return await ItemDefinitionSchema.create(itemDefinition)
}
/**
 * Finds an itemDefinition by its id
 * @id The id of the ItemDefinition object to find
 * @returns The ItemDefinition given by the itemDefinition parameter
 */
export async function getItemDefinition(id: string) {
  await mongoDb()
  return await ItemDefinitionSchema.findById(id)
}

/**
 * Updates an existing ItemDefinition object (identified by id) with a new ItemDefinition object
 * @param id The id of the ItemDefinition objecting being updated
 * @param itemDefinition The ItemDefinition object to update the existing ItemDefinition object with
 * @returns The updated ItemDefinition object
 */
export async function updateItemDefinition(
  id: string,
  itemDefinition: ItemDefinition
) {
  await mongoDb()
  return await ItemDefinitionSchema.findByIdAndUpdate(id, itemDefinition)
}

/**
 * Deletes the ItemDefinition object with the given id
 * @param id The id of the ItemDefinition object to delete
 */
export async function deleteItemDefinition(id: string) {
  await mongoDb()
  await ItemDefinitionSchema.findByIdAndDelete(id)
}
