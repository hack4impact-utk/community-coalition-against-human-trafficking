import { model, Schema, Document, models, Model } from 'mongoose'
import { User } from 'utils/types'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
})

export interface UserDocument extends Omit<User, '_id'>, Document {}

export default (models.User as Model<UserDocument>) ||
  model<UserDocument>('User', UserSchema)
