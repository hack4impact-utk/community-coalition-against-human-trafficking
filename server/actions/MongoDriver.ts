import mongoDb from '../index'
import { Document, Model } from 'mongoose'
import '../../utils/types'
import { ApiError, ServerModel } from '../../utils/types'

const ObjectId = require('mongoose').Types.ObjectId
const entityNotFoundMessage = 'Entity does not exist'

/**
 * Gets a single Entity object from the database with the given id
 * @param dbSchema - The schema of the entity object to get
 * @param id - The _id of the entity object to get
 * @returns A single entity object
 */
export async function getEntity<Schema extends Document>(
  dbSchema: Model<Schema>,
  id: string
) {
  await mongoDb()

  let response = await dbSchema.findById(id)
  if (!response) throw new ApiError(404, entityNotFoundMessage)
  return response
}

/**
 * Returns all entities from a collection
 * @param dbSchema The collection schema to get entities from
 * @returns A list of all entities in the collection
 */
export async function getEntities<Schema extends Document>(
  dbSchema: Model<Schema>
) {
  await mongoDb()

  let response = await dbSchema.find()
  return response
}

/**
 * Creates a new Entity object in the database
 * @param dbSchema The collection schema to get entities from
 * @param document - The Entity object to create
 * @returns The _id of the newly created Entity object in the database
 */
export async function createEntity<
  Schema extends Document,
  T extends ServerModel
>(dbSchema: Model<Schema>, document: T) {
  await mongoDb()

  let response = await dbSchema.create(document)
  return response
}

/**
 * Updates the existing Entity object with _id of entityId with the new entity
 * @param dbSchema The collection schema to get entities from
 * @param id - _id of the Entity object to update
 * @param document - The new Entity object to update the existing Entity object with
 */
export async function updateEntity<
  Schema extends Document,
  T extends ServerModel
>(dbSchema: Model<Schema>, id: string, document: T) {
  await mongoDb()

  let response = await dbSchema.findByIdAndUpdate(id, document)
  if (!response) throw new ApiError(404, entityNotFoundMessage)
}

/**
 * Deletes the Entity object with the given entityId
 * @param dbSchema The collection schema to get entities from
 * @param id - The _id of the Entity object to delete
 */
export async function deleteEntity<Schema extends Document>(
  dbSchema: Model<Schema>,
  id: string
) {
  await mongoDb()

  await dbSchema.findByIdAndDelete(id, (response: any) => {
    if (!response) {
      throw new ApiError(404, entityNotFoundMessage)
    }
  })
}

export async function findEntity<
  Schema extends Document,
  T extends ServerModel
>(dbSchema: Model<Schema>, filterDocument: T) {
  await mongoDb()

  return await dbSchema.find(filterDocument)
}
