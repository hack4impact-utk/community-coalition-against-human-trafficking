import { model, Schema, Document, models, Model } from 'mongoose'
import { InventoryItem } from '../../utils/types'

const attributeValueSchema = new Schema({
  attribute: {
    type: { type: Schema.Types.ObjectId, ref: 'Attribute' },
    required: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
})

const InventoryItemSchema = new Schema({
  itemDefinition: {
    type: { type: Schema.Types.ObjectId, ref: 'ItemDefinition' },
    required: true,
  },
  attributes: {
    type: [attributeValueSchema],
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
  model<InventoryItemDocument>('InventoryItem', InventoryItemSchema)
