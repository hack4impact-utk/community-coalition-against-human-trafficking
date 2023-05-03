import { model, Schema, Document, models, Model } from 'mongoose'
import { Log } from 'utils/types'

const LogSchema = new Schema({
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true,
  },
  quantityDelta: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  softDelete: {
    type: Boolean,
    required: false,
  },
})

export interface LogDocument extends Omit<Log, '_id'>, Document {}

export default (models.Log as Model<LogDocument>) ||
  model<LogDocument>('Log', LogSchema, 'logs')
