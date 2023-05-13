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

const presentItemDefinitionsPipeline: PipelineStage[] = [
  // pull in all inventory items fpr each item definition
  {
    $lookup: {
      from: 'inventoryItems',
      localField: '_id',
      foreignField: 'itemDefinition',
      as: 'inventoryItems',
    },
  },

  // filter out inventory items with quantity 0
  {
    $set: {
      inventoryItems: {
        $filter: {
          input: '$inventoryItems',
          as: 'item',
          cond: { $gt: ['$$item.quantity', 0] },
        },
      },
    },
  },

  // at this point, each document (itemDefinition) has an array called "inventoryItems"
  // that contains all inventory items that have that itemDefinition

  // filter out item definitions where Document.inventoryItems.length === 0
  // this indicates that there are no inventory items with quantity > 0 in the warehouse
  // with the given itemDefinitionId
  {
    $match: {
      inventoryItems: { $ne: [] },
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

/**
 * Finds all itemDefinitions that do not have the softDelete flag
 * @returns All itemDefinitions that do not have the softDelete flag
 */
export async function getPresentItemDefinitions() {
  return (await ItemDefinitionSchema.aggregate(
    presentItemDefinitionsPipeline
  )) as ItemDefinitionResponse[]
}
