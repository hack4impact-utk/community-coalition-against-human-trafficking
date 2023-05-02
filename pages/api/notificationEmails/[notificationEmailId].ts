import { NextApiRequest, NextApiResponse } from 'next'
import {
  ApiError,
  NotificationEmailPutRequest,
  NotificationEmailResponse,
} from 'utils/types'
import { serverAuth } from 'utils/auth'
import {
  apiNotificationEmailValidation,
  apiObjectIdValidation,
} from 'utils/apiValidators'
import NotificationEmailSchema from 'server/models/NotificationEmail'
import * as MongoDriver from 'server/actions/MongoDriver'
import { errors } from 'utils/constants/errors'

// @route GET api/notifications/[notificationEmailId] - Returns a single NotificationEmail object given by a notificationEmailId - Private
// @route PUT api/notifications/[notificationEmailId] - Updates an existing NotificationEmail object (identified by notificationEmailId) with a new NotificationEmail object - Private
// @route DELETE api/attributes/[notificationEmailId] - Deletes a single NotificationEmail object (identified by notificationEmailId) - Private
export default async function notificationEmailHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)
    apiObjectIdValidation(req?.query?.notificationEmailId as string)
    const notificationEmailId = req.query.notificationEmailId as string

    switch (req.method) {
      case 'GET': {
        const notification: NotificationEmailResponse =
          await MongoDriver.getEntity(
            NotificationEmailSchema,
            notificationEmailId
          )

        return res.status(200).json({
          success: true,
          payload: notification,
        })
      }
      case 'PUT': {
        apiNotificationEmailValidation(req.body, 'PUT')
        const updatedNotificationEmail: NotificationEmailPutRequest = req.body

        await MongoDriver.updateEntity(
          NotificationEmailSchema,
          notificationEmailId,
          updatedNotificationEmail
        )

        return res.status(200).json({
          succcess: true,
          payload: {},
        })
      }
      case 'DELETE': {
        await MongoDriver.deleteEntity(
          NotificationEmailSchema,
          notificationEmailId
        )

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      default: {
        throw new ApiError(405, errors.invalidReqMethod)
      }
    }
  } catch (e) {
    // TODO add else if it is not an instance of ApiError
    if (e instanceof ApiError) {
      return res.status(e.statusCode).json({
        success: false,
        message: e.message,
      })
    }
  }
}
