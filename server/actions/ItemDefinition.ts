import ItemDefinitionSchema from 'server/models/ItemDefinition'
import { getEntities, getEntity } from 'server/actions/MongoDriver'
import { ItemDefinitionResponse } from 'utils/types'

/**
 * Finds an itemDefinition by its id
 * @id The id of the ItemDefinition object to find
 * @returns The ItemDefinition given by the itemDefinition parameter
 */
export async function getItemDefinition(id: string) {
  return await getEntity(ItemDefinitionSchema, id, [
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $lookup: {
        from: 'attributes',
        localField: 'attributes',
        foreignField: '_id',
        as: 'attributes',
      },
    },
    {
      $set: {
        category: { $arrayElemAt: ['$category', 0] },
      },
    },
  ]) as ItemDefinitionResponse
}

/**
 * Finds all itemDefinitions
 * @returns All itemDefinitions
 */
export async function getItemDefinitions() {
  return await getEntities(ItemDefinitionSchema, [
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $lookup: {
        from: 'attributes',
        localField: 'attributes',
        foreignField: '_id',
        as: 'attributes',
      },
    },
    {
      $set: {
        category: { $arrayElemAt: ['$category', 0] },
      },
    },
  ]) as ItemDefinitionResponse[]
}
