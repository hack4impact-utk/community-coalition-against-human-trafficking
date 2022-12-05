import mongoDb from '../index'
import UserSchema from '../models/User'
import { User } from '../../utils/types'

export async function getUser(id: number) {
  await mongoDb()
  return await UserSchema.findById(id)
}

export async function createUser(user: User) {
  await mongoDb()

  return await UserSchema.create(user)
}

export async function updateUser(id: number, user: User) {
  await mongoDb()

  return await UserSchema.findByIdAndUpdate(id, user)
}

export async function deleteUser(id: number) {
  await mongoDb()

  return await UserSchema.findByIdAndDelete(id)
}
