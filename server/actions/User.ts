import mongoDb from '../index'
import UserSchema from '../models/User'
import { User } from '../../utils/types'

export async function createUser(user: User) {
  await mongoDb()

  return await UserSchema.create(user)
}
