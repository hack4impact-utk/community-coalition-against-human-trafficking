import mongoDb from '../index'
import CategorySchema from '../models/Category'
import { getEntities, getEntity } from './MongoDriver'

/**
 * Returns all categories from the database
 * @returns A list of all categories
 */
export async function getCategories() {
  await mongoDb()
  return await getEntities(CategorySchema)
}

/**
 * Gets a single Category object from the database with the given id
 * @param id The id of the Category object to get
 * @returns A single Category object
 */
export async function getCategory(id: string) {
  await mongoDb()
  return await getEntity(CategorySchema, id)
}
