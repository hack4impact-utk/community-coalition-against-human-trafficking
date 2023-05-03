import { model, Schema, Document, models, Model } from 'mongoose'
import { ItemDefinition } from 'utils/types'

const ItemDefinitionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    attributes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Attribute' }],
      required: false,
      default: [],
    },
    internal: {
      type: Boolean,
      required: false,
      default: false,
    },
    lowStockThreshold: {
      type: Number,
      required: false,
      default: -1,
    },
    criticalStockThreshold: {
      type: Number,
      required: false,
      default: -1,
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

export interface ItemDefinitionDocument
  extends Omit<ItemDefinition, '_id'>,
    Document {}

export default (models.ItemDefinition as Model<ItemDefinitionDocument>) ||
  model<ItemDefinitionDocument>(
    'ItemDefinition',
    ItemDefinitionSchema,
    'itemDefinitions'
  )
