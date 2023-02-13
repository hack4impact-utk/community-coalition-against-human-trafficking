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
  validateObjectId(id)
  await mongoDb()

  let response = await dbSchema.findById(id)
  if (!response) throw new ApiError(404, entityNotFoundMessage)
  return response
}

/**
 * Returns all entities from a collection
 * @returns A list of all entities in the collection
 */
export async function getEntities<Schema extends Document>(
  dbSchema: Model<Schema>
) {
  await mongoDb()

  let response = await dbSchema.find()
  if (!response) throw new ApiError(404, 'No entities found')
  return response
}

/**
 * Creates a new Entity object in the database
 * @param user - The Entity object to create
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
 * @param id - _id of the Entity object to update
 * @param user - The new Entity object to update the existing Entity object with
 */
export async function updateEntity<
  Schema extends Document,
  T extends ServerModel
>(dbSchema: Model<Schema>, id: string, document: T) {
  validateObjectId(id)
  await mongoDb()

  let response = await dbSchema.findByIdAndUpdate(id, document)
  if (!response) throw new ApiError(404, entityNotFoundMessage)
}

/**
 * Deletes the Entity object with the given entityId
 * @param id - The _id of the Entity object to delete
 */
export async function deleteEntity<Schema extends Document>(
  dbSchema: Model<Schema>,
  id: string
) {
  validateObjectId(id)
  await mongoDb()

  dbSchema.findByIdAndDelete(id, (response: any) => {
    if (!response) {
      throw new ApiError(404, entityNotFoundMessage)
    }
  })
}

/**
 * Validates a given id to ensure it is a valid ObjectId. Throws an error if invalid.
 * @param id - The ObjectId to validate
 */
function validateObjectId(id: string) {
  let isValid: boolean = false
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) isValid = true
  }

  if (!isValid) {
    throw new ApiError(400, 'Invalid document Id')
  }
}
