import { model, Schema, Document, models, Model } from 'mongoose'
import { InventoryItem } from 'utils/types'

const InventoryItemSchema = new Schema({
  itemDefinition: {
    type: {
      type: Schema.Types.ObjectId,
      ref: 'ItemDefinition',
      required: true,
    },
  },
  attributes: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Attribute' }],
    required: false,
    default: [],
  },
  quantity: {
    type: Number,
    required: true,
  },
  assignee: {
    type: { type: Schema.Types.ObjectId, ref: 'User' },
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
