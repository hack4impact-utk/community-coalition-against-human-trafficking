import mongoDb from '../index'
import ItemDefinitionSchema from '../models/ItemDefinition'

export async function getItemDefinitions() {
  await mongoDb()
  return await ItemDefinitionSchema.find()
}
