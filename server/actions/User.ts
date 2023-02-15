import mongoDb from '../index'
import UserSchema from '../models/User'
import { User } from '../../utils/types'

/**
 * Gets a single User object from the database with the given userId
 * @param id - The _id of the User object to get
 * @returns A single User object
 */
export async function getUser(id: string) {
  await mongoDb()
  return await UserSchema.findById(id)
}

/**
 * Gets all User objects from the database
 * @returns A single User object
 */
export async function getUsers() {
  await mongoDb()
  return await UserSchema.find()
}

/**
 * Creates a new User object in the database
 * @param user - The User object to create
 * @returns The newly created User object from the database
 */
export async function createUser(user: User) {
  await mongoDb()

  return await UserSchema.create(user)
}

/**
 * Updates the existing User object with _id of userId with the new user
 * @param id - _id of the User object to update
 * @param user - The new User object to update the existing User object with
 * @returns The updated User object
 */
export async function updateUser(id: string, user: User) {
  await mongoDb()

  return await UserSchema.findByIdAndUpdate(id, user)
}

/**
 * Deletes the User object with the given userId
 * @param id - The _id of the User object to delete
 */
export async function deleteUser(id: string) {
  await mongoDb()

  await UserSchema.findByIdAndDelete(id)
}
