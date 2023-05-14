import ItemDefinitionSchema from 'server/models/ItemDefinition'
import InventoryItemSchema from 'server/models/InventoryItem'
import { getEntities, getEntity } from 'server/actions/MongoDriver'
import {
  InventoryItemExistingAttributeValuesResponse,
  ItemDefinitionResponse,
} from 'utils/types'
import { PipelineStage, Types } from 'mongoose'

const getRequestPipeline: PipelineStage[] = [
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

// find all inventory items with the matching itemDefinitionId
// for each of those, get the unique attribute values of each
const existingAttributeValuesPipeline: PipelineStage[] = [
  // find all inventory items with the given itemDefinition
  {
    $lookup: {
      from: 'inventoryItems',
      localField: '_id',
      foreignField: 'itemDefinition',
      as: 'inventoryItems',
    },
  },

  // only get the array of inventory items, nothing else with the item definition
  {
    $project: {
      _id: 0,
      inventoryItems: 1,
    },
  },

  // puts each inventoryItem.attributes array into a new array
  // structure is now "inventoryItemAttrArr": [inventoryItem[0].attributes, inventoryItem[1].attributes, ...]
  {
    $group: {
      _id: null,
      inventoryItemAttrArr: { $push: '$inventoryItems.attributes' },
    },
  },
  {
    $set: {
      inventoryItemAttrArr: { $arrayElemAt: ['$inventoryItemAttrArr', 0] },
    },
  },

  // removes _id field from above array
  {
    $project: {
      _id: 0,
    },
  },

  // change format from "inventoryItemAttrArr": [inventoryItem[0].attributes, inventoryItem[1].attributes, ...]
  // to [{inventoryItemAttrArr: {attribute: ..., value: ...}}, ...]
  { $unwind: '$inventoryItemAttrArr' },
  { $unwind: '$inventoryItemAttrArr' },

  // group each inventoryItem[i].attributes[j] by unique attribute Id
  // format is now [ { _id: ID, values: [ARRAY_OF_VALUES] }, ... ]
  {
    $group: {
      _id: '$inventoryItemAttrArr.attribute',
      values: { $addToSet: '$inventoryItemAttrArr.value' }, // $addToSet creates the array and removes duplicates
    },
  },
]

const softDeleteRequestPipeline: PipelineStage[] = [
  ...getRequestPipeline,
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
    getRequestPipeline
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
 * Finds all itemDefinitions have corresponding inventory items with quantity > 0
 * @returns All itemDefinitions that have inventory items with quantity > 0
 */
export async function getPresentItemDefinitions() {
  return (await ItemDefinitionSchema.aggregate(
    presentItemDefinitionsPipeline
  )) as ItemDefinitionResponse[]
}

export async function getItemDefinitionAttributeValues(id: string) {
  // only look at the target itemDefinition
  const pipeline = [
    {
      $match: { _id: new Types.ObjectId(id) },
    },
    ...existingAttributeValuesPipeline,
  ]

  return (await ItemDefinitionSchema.aggregate(
    pipeline
  )) as InventoryItemExistingAttributeValuesResponse[]
}
