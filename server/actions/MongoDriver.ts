import mongoDb from '../index'
import { Document, FilterQuery, Model, PipelineStage, Types } from 'mongoose'
import '../../utils/types'
import { ApiError, ItemDefinition, ServerModel } from '../../utils/types'
import Category from '../models/Category'

const ENTITY_NOT_FOUND_MESSAGE = 'Entity does not exist'

/**
 * Gets a single Entity object from the database with the given id
 * @param dbSchema - The schema of the entity object to get
 * @param id - The _id of the entity object to get
 * @returns A single entity object
 */
export async function getEntity<Schema extends Document>(
  dbSchema: Model<Schema>,
  id: string,
  aggregate?: PipelineStage[]
) {
  await mongoDb()

  // if populate is defined, use that instead of simple find
  if (!!aggregate) {
    const objectId = new Types.ObjectId(id)
    aggregate.push({ $match: { _id: objectId } })
    const response = await dbSchema.aggregate(aggregate)
    if (!response) throw new ApiError(404, ENTITY_NOT_FOUND_MESSAGE)
    return response
  }

  const response = await dbSchema.findById(id)
  if (!response) throw new ApiError(404, ENTITY_NOT_FOUND_MESSAGE)
  return response
}

/**
 * Returns all entities from a collection
 * @param dbSchema The collection schema to get entities from
 * @returns A list of all entities in the collection
 */
export async function getEntities<Schema extends Document>(
  dbSchema: Model<Schema>,
  aggregate?: PipelineStage[]
) {
  await mongoDb()

  // if populate is defined, use that instead of simple find
  if (!!aggregate) {
    const response = await dbSchema.aggregate(aggregate)
    return response
  }

  const response = await dbSchema.find()
  return response
}

/**
 * Creates a new Entity object in the database
 * @param dbSchema The collection schema to get entities from
 * @param document - The Entity object to create
 * @returns The newly created Entity object in the database
 */
export async function createEntity<
  Schema extends Document,
  T extends ServerModel
>(dbSchema: Model<Schema>, document: T) {
  await mongoDb()

  const response = await dbSchema.create(document)
  return response
}

/**
 * Replaces the existing Entity object with the given id with a new entity
 * @param dbSchema The collection schema to get entities from
 * @param id - _id of the Entity object to update
 * @param document - The new Entity object to replace the existing Entity object with
 */
export async function updateEntity<
  Schema extends Document,
  T extends ServerModel
>(dbSchema: Model<Schema>, id: string, document: T) {
  await mongoDb()

  const response = await dbSchema.findByIdAndUpdate(id, document)
  if (!response) throw new ApiError(404, ENTITY_NOT_FOUND_MESSAGE)
}

/**
 * Deletes the Entity object with the given id
 * @param dbSchema The collection schema to get entities from
 * @param id - The _id of the Entity object to delete
 */
export async function deleteEntity<Schema extends Document>(
  dbSchema: Model<Schema>,
  id: string
) {
  await mongoDb()

  await dbSchema.findByIdAndDelete(id, (response: unknown) => {
    if (!response) {
      throw new ApiError(404, ENTITY_NOT_FOUND_MESSAGE)
    }
  })
}

/**
 * Gets all Entity objects from the database that match the given filter document
 * @param dbSchema - The schema of the entity objects to get
 * @param filterDocument - An enttiy object that defines the fields to filter by
 * @returns All entity objects that match the filter
 */
export async function findEntities<
  T extends ServerModel,
  Schema extends Omit<T, '_id'> & Document
>(dbSchema: Model<Schema>, filterDocument: Partial<T> | T) {
  // if a blank filter is applied, it returns all entities in the database.
  // We don't want this, so return an empty array
  if (Object.keys(filterDocument).length < 1) return []

  await mongoDb()
  const query: FilterQuery<ItemDefinition> = {}
  for (const key in filterDocument) {
    query[key] = filterDocument[key]
  }

  return await dbSchema.find(query)
}
