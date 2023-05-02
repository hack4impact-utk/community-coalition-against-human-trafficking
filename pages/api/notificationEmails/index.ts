import { NextApiRequest, NextApiResponse } from 'next'
import {
  ApiError,
  NotificationEmailPostRequest,
  NotificationEmailResponse,
} from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiNotificationEmailValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import NotificationEmailSchema from 'server/models/NotificationEmail'
import { errors } from 'utils/constants/errors'

// @route GET api/notificationEmails - Returns a list of all Notifications in the database - Private
// @route POST /api/notificationEmails - Create a Notification from request body - Private
export default async function notificationEmailsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    switch (req.method) {
      case 'GET': {
        const notificationEmails: NotificationEmailResponse[] =
          await MongoDriver.getEntities(NotificationEmailSchema)
        const resStatus = notificationEmails.length ? 200 : 204
        return res.status(resStatus).json({
          success: true,
          payload: notificationEmails,
        })
      }
      case 'POST': {
        apiNotificationEmailValidation(req.body, 'POST')
        const notificationEmails: NotificationEmailPostRequest = req.body
        const response: NotificationEmailResponse =
          await MongoDriver.createEntity(
            NotificationEmailSchema,
            notificationEmails
          )

        return res.status(201).json({
          success: true,
          payload: response._id,
        })
      }
      default: {
        throw new ApiError(405, errors.invalidReqMethod)
      }
    }
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.statusCode).json({
        success: false,
        message: e.message,
      })
    }
  }
}
