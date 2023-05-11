import { model, Schema, Document, models, Model } from 'mongoose'
import { Attribute } from 'utils/types'

const AttributeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // TODO: change from mixed to one of "text", "number" or string[]
    possibleValues: {
      type: Schema.Types.Mixed,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    softDelete: {
      type: Boolean,
      required: false,
    },
  },
  {
    versionKey: false,
  }
)

export interface AttributeDocument extends Omit<Attribute, '_id'>, Document {}

export default (models.Attribute as Model<AttributeDocument>) ||
  model<AttributeDocument>('Attribute', AttributeSchema)
