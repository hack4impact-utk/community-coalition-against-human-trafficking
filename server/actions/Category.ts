import mongoDb from '../index'
import CategorySchema from '../models/Category'
import { Category } from '../../utils/types'
import {
  createEntity,
  deleteEntity,
  getEntities,
  getEntity,
  updateEntity,
} from './MongoDriver'

/**
 * Creates a new Category object in the database
 * @param category The Category object to create
 * @returns The newly created User objcet from the database
 */
export async function createCategory(category: Category) {
  await mongoDb()
  return await createEntity(CategorySchema, category)
}

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

/**
 * Updates an existing Category object (identified by id) with a new Category object
 * @param id The id of the Category object being updated
 * @param category The Category object to update the existing Category object with
 * @returns The updated Category object
 */
export async function updateCategory(id: string, category: Category) {
  await mongoDb()
  return await updateEntity(CategorySchema, id, category)
}

/**
 * Deletes the Category object with the given id
 * @param id The id of the Category object to delete
 */
export async function deleteCategory(id: string) {
  await mongoDb()
  await deleteEntity(CategorySchema, id)
}
