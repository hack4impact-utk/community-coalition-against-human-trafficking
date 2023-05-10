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
// for each of those, get the attribute value of each of them
// somehow return those in an array??
const existingAttributeValuesPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: 'inventoryItems',
      localField: '_id',
      foreignField: 'itemDefinition',
      as: 'inventoryItems',
    },
  },
  // gets ONLY an array of inventoryItems
  {
    $project: {
      inventoryItems: 1,
    },
  },
  // {
  //   $unwind: '$inventoryItems',
  // },
  // {
  //   $project: {
  //     'inventoryItems._id': 0,
  //   },
  // },
  // gets an array of arrays of inventoryItemAttribute objects (one array element per inventoryItem). stored as 'attributes'
  {
    $project: {
      attributes: '$inventoryItems.attributes',
    },
  },
  // creates an single array of inventoryItemAttribute objects
  {
    $unwind: '$attributes',
  },
  // {
  //   $unwind: '$attributes',
  // },
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
  const objectId = new Types.ObjectId(id)
  // existingAttributeValuesPipeline.push({ $match: { _id: objectId } })

  // return await ItemDefinitionSchema.aggregate(existingAttributeValuesPipeline)
  let outputArray = []
  const itemDefinition = await ItemDefinitionSchema.findById(objectId)
  const inventoryItems = (await InventoryItemSchema.find()).filter(
    (item) => (item.itemDefinition as string) === objectId
  )
}
