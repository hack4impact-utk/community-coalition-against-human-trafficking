import mongoDb from '../index'
import AttributeSchema from '../models/Attribute'
import { Attribute } from '../../utils/types'

/**
 * Creates a new Attribute object in the database
 * @param attribute The Attribute object to create
 * @returns The newly created Attribute object from the database
 */
export async function createAttribute(attribute: Attribute) {
  await mongoDb()
  return await AttributeSchema.create(attribute)
}

/**
 * Returns all attributes in the database
 * @returns A list of all attributes
 */
export async function getAttributes() {
  await mongoDb()
  return await AttributeSchema.find()
}

/**
 * Finds an attribute by its id
 * @id The id of the Attribute object to find
 * @returns The Attribute given by the attribute parameter
 */
export async function getAttribute(id: string) {
  await mongoDb()
  return await AttributeSchema.findById(id)
}

/**
 * Updates an existing Attribute object (identified by id) with a new Attribute object
 * @param id The id of the Attribute objecting being updated
 * @param attribute The Attribute object to update the existing Attribute object with
 * @returns The updated Attribute object
 */
export async function updateAttribute(id: string, attribute: Attribute) {
  await mongoDb()
  return await AttributeSchema.findByIdAndUpdate(id, attribute)
}

/**
 * Deletes the Attribute object with the given id
 * @param id The id of the Attribute object to delete
 */
export async function deleteAttribute(id: string) {
  await mongoDb()
  await AttributeSchema.findByIdAndDelete(id)
}
