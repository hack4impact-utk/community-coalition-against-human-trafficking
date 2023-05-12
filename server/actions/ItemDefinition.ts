import ItemDefinitionSchema from 'server/models/ItemDefinition'
import InventoryItemSchema from 'server/models/InventoryItem'
import { getEntities, getEntity } from 'server/actions/MongoDriver'
import { ItemDefinitionResponse } from 'utils/types'
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
 * Finds all itemDefinitions
 * @returns All itemDefinitions
 */
export async function getItemDefinitions() {
  return (await getEntities(
    ItemDefinitionSchema,
    getRequestPipeline
  )) as ItemDefinitionResponse[]
}

export async function getItemDefinitionAttributeValues(id: string) {
  // only look at the target itemDefinition
  existingAttributeValuesPipeline.unshift({
    $match: { _id: new Types.ObjectId(id) },
  })

  return await ItemDefinitionSchema.aggregate(existingAttributeValuesPipeline)
}
