import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, AppConfigPostRequest, AppConfigResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiAppConfigValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import AppConfigSchema from 'server/models/AppConfig'
import { errors } from 'utils/constants/errors'
import { getAppConfigs } from 'server/actions/AppConfig'

// @route GET api/appConfigs - Returns a list of all Notifications in the database - Private
// @route POST /api/appConfigs - Create a Notification from request body - Private
export default async function appConfigsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    switch (req.method) {
      case 'GET': {
        const appConfigs: AppConfigResponse[] = await getAppConfigs()
        const resStatus = appConfigs.length ? 200 : 204
        console.log(appConfigs)
        return res.status(resStatus).json({
          success: true,
          payload: appConfigs,
        })
      }
      case 'POST': {
        apiAppConfigValidation(req.body, 'POST')
        const appConfigs: AppConfigPostRequest = req.body
        const response = await MongoDriver.createEntity(
          AppConfigSchema,
          appConfigs
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
