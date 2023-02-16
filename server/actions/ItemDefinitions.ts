import mongoDb from '../index'
import ItemDefinitionSchema from '../models/ItemDefinition'

/**
 * Finds all itemDefinitions
 * @returns All itemDefinitions
 */
export async function getItemDefinitions() {
  await mongoDb()
  return await ItemDefinitionSchema.find()
}
