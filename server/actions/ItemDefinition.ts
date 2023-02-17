import mongoDb from '../index'
import ItemDefinitionSchema from '../models/ItemDefinition'
import { getEntities, getEntity } from './MongoDriver'

/**
 * Finds an itemDefinition by its id
 * @id The id of the ItemDefinition object to find
 * @returns The ItemDefinition given by the itemDefinition parameter
 */
export async function getItemDefinition(id: string) {
  return await getEntity(ItemDefinitionSchema, id)
}

/**
 * Finds all itemDefinitions
 * @returns All itemDefinitions
 */
export async function getItemDefinitions() {
  return await getEntities(ItemDefinitionSchema)
}
