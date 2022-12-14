import { model, Schema, Document, models, Model } from 'mongoose'
import { Category } from '../../utils/types'

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
})

export interface CategoryDocument extends Omit<Category, '_id'>, Document {}

export default (models.Category as Model<CategoryDocument>) ||
  model<CategoryDocument>('Category', CategorySchema)
