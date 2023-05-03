import { model, Schema, Document, models, Model } from 'mongoose'
import { NotificationEmail } from 'utils/types'

const NotificationEmailSchema = new Schema({
  emails: {
    type: [String],
    required: true,
  },
  softDelete: {
    type: Boolean,
    required: false,
  },
})

export interface NotificationEmailDocument
  extends Omit<NotificationEmail, '_id'>,
    Document {}
export default (models.NotificationEmail as Model<NotificationEmailDocument>) ||
  model<NotificationEmailDocument>(
    'NotificationEmail',
    NotificationEmailSchema,
    'notificationEmails'
  )
