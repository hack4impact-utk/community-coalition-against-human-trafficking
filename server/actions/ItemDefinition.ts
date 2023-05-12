import ItemDefinitionSchema from 'server/models/ItemDefinition'
import { getEntities, getEntity } from 'server/actions/MongoDriver'
import { ItemDefinitionResponse } from 'utils/types'
import { PipelineStage } from 'mongoose'

const requestPipeline: PipelineStage[] = [
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
]

const softDeleteRequestPipeline: PipelineStage[] = [
  ...requestPipeline,
  {
    $match: {
      softDelete: { $exists: false },
    },
  },
]

/**
 * Finds an itemDefinition by its id
 * @id The id of the ItemDefinition object to find
 * @returns The ItemDefinition given by the itemDefinition parameter
 */
export async function getItemDefinition(id: string) {
  return (await getEntity(
    ItemDefinitionSchema,
    id,
    requestPipeline
  )) as ItemDefinitionResponse
}

/**
 * Finds all itemDefinitions that do not have the softDelete flag
 * @returns All itemDefinitions that do not have the softDelete flag
 */
export async function getItemDefinitions() {
  return (await getEntities(
    ItemDefinitionSchema,
    softDeleteRequestPipeline
  )) as ItemDefinitionResponse[]
}
