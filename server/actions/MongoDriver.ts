import mongoDb from '../index'
import { Document, Model } from 'mongoose'
import '../../utils/types'
import { ApiError, ServerModel } from '../../utils/types'

const ObjectId = require('mongoose').Types.ObjectId

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
  return await dbSchema.findById(id)
}

/**
 * Creates a new Entity object in the database
 * @param user - The Entity object to create
 * @returns The newly created Entity object from the database
 */
export async function createEntity<
  Schema extends Document,
  T extends ServerModel
>(dbSchema: Model<Schema>, document: T) {
  await mongoDb()
  return await dbSchema.create(document)
}

/**
 * Updates the existing Entity object with _id of entityId with the new entity
 * @param id - _id of the Entity object to update
 * @param user - The new Entity object to update the existing Entity object with
 * @returns The updated Entity object
 */
export async function updateEntity<
  Schema extends Document,
  T extends ServerModel
>(dbSchema: Model<Schema>, id: string, document: T) {
  await mongoDb()

  return await dbSchema.findByIdAndUpdate(id, document)
}

/**
 * Deletes the Entity object with the given entityId
 * @param id - The _id of the Entity object to delete
 */
export async function deleteEntity<Schema extends Document>(
  dbSchema: Model<Schema>,
  id: string
) {
  await mongoDb()

  await dbSchema.findByIdAndDelete(id)
}

function validateObjectId(id: string) {
  let isValid: boolean = false
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) isValid = true
  }

  if (!isValid) {
    throw new ApiError(400, 'Invalid _id')
  }
}
