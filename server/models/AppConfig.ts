import { model, Schema, Document, models, Model } from 'mongoose'
import { AppConfig } from 'utils/types'

const AppConfigSchema = new Schema(
  {
    emails: {
      type: [String],
      required: true,
    },
    defaultAttributes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Attribute' }],
      required: true,
    },
  },
  {
    versionKey: false,
  }
)

export interface AppConfigDocument extends Omit<AppConfig, '_id'>, Document {}
export default (models.AppConfig as Model<AppConfigDocument>) ||
  model<AppConfigDocument>('AppConfig', AppConfigSchema, 'appConfigs')
