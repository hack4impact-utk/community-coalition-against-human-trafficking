import { model, Schema, Document, models, Model } from 'mongoose'
import { InventoryItem } from 'utils/types'

const InventoryItemSchema = new Schema({
  itemDefinition: {
    type: Schema.Types.ObjectId,
    ref: 'ItemDefinition',
    required: true,
  },
  attributes: [
    {
      attribute: {
        _id: false,
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Attribute',
      },
      // value is either string or number
      value: { type: Schema.Types.Mixed, required: true },
      _id: false,
    },
  ],
  quantity: {
    type: Number,
    required: true,
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
})

export interface InventoryItemDocument
  extends Omit<InventoryItem, '_id'>,
    Document {}

export default (models.InventoryItem as Model<InventoryItemDocument>) ||
  model<InventoryItemDocument>(
    'InventoryItem',
    InventoryItemSchema,
    'inventoryItems'
  )
