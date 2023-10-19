import mongoDb from 'server/index'
import {
  Document,
  FilterQuery,
  HydratedDocument,
  Model,
  PipelineStage,
  Types,
} from 'mongoose'
import 'utils/types'
import {
  ApiError,
  ServerModel,
  ServerPostRequest,
  ServerPutRequest,
} from 'utils/types'
import { ObjectId } from 'mongodb'
import { errors } from 'utils/constants/errors'

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
): Promise<Schema & { _id: ObjectId }> {
  await mongoDb()

  let response

  // if aggregate is defined, use that instead of simple find
  if (!!aggregate) {
    const pipeline = [...aggregate]
    const objectId = new Types.ObjectId(id)
    pipeline.push({ $match: { _id: objectId } })
    response = (await dbSchema.aggregate(pipeline))[0]
  } else {
    response = await dbSchema.findById(id)
  }
  if (!response) throw new ApiError(404, errors.notFound)
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
): Promise<HydratedDocument<Schema>[]> {
  await mongoDb()
  let response

  // if aggregate is defined, use that instead of simple find
  if (!!aggregate) {
    response = await dbSchema.aggregate(aggregate)
  } else {
    response = await dbSchema.find()
  }

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
  T extends ServerPostRequest
>(dbSchema: Model<Schema>, document: T): Promise<HydratedDocument<Schema>> {
  await mongoDb()

  const response = await dbSchema.create(document).catch((err) => {
    if (err.code === 11000) {
      throw new ApiError(400, errors.duplicate)
    } else {
      throw new ApiError(500, errors.serverError)
    }
  })
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
  T extends ServerPutRequest
>(
  dbSchema: Model<Schema>,
  id: string,
  document: T
): Promise<HydratedDocument<Schema>> {
  await mongoDb()

  const response = await dbSchema
    .findByIdAndUpdate(id, document)
    .catch((err) => {
      if (err.code === 11000) {
        throw new ApiError(400, errors.duplicate)
      } else {
        throw new ApiError(500, errors.serverError)
      }
    })
  if (!response) throw new ApiError(404, errors.notFound)
  return response
}

/**
 * Deletes the Entity object with the given id
 * @param dbSchema The collection schema to get entities from
 * @param id - The _id of the Entity object to delete
 */
export async function deleteEntity<Schema extends Document>(
  dbSchema: Model<Schema>,
  id: string
): Promise<void> {
  await mongoDb()

  const response = await dbSchema.findByIdAndDelete(id)
  if (!response) {
    throw new ApiError(404, errors.notFound)
  }
}

/**
 * Soft deletes the Entity object with the given id (sets the softDelete prop to true)
 * @param dbSchema The collection schema to get entities from
 * @param id - The _id of the Entity object to soft delete
 */
export async function softDeleteEntity<Schema extends Document>(
  dbSchema: Model<Schema>,
  id: string
): Promise<HydratedDocument<Schema, unknown, unknown>> {
  await mongoDb()

  const response = await dbSchema.findByIdAndUpdate(id, { softDelete: true })
  if (!response) {
    throw new ApiError(404, errors.notFound)
  }

  return response
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
>(
  dbSchema: Model<Schema>,
  filterDocument: Partial<T> | T
): Promise<HydratedDocument<Schema>[]> {
  // if a blank filter is applied, it returns all entities in the database.
  // We don't want this, so return an empty array
  if (Object.keys(filterDocument).length < 1) return []

  await mongoDb()
  const query: FilterQuery<T> = {}
  for (const key in filterDocument) {
    query[key] = filterDocument[key]
  }

  return await dbSchema.find(query)
}

/**
 * Gets all Entity objects from the database that match the given query
 * @param dbSchema - The schema of the entity objects to get
 * @param query - A query object
 * @returns All entity objects that match the query
 */
export async function findEntitiesByQuery<
  T extends ServerModel,
  Schema extends Omit<T, '_id'> & Document
>(
  dbSchema: Model<Schema>,
  query: FilterQuery<Schema>
): Promise<HydratedDocument<Schema>[]> {
  await mongoDb()

  return await dbSchema.find(query)
}
