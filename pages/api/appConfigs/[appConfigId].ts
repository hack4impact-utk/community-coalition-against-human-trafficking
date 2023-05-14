import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, AppConfigPutRequest, AppConfigResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import {
  apiAppConfigValidation,
  apiObjectIdValidation,
} from 'utils/apiValidators'
import AppConfigSchema from 'server/models/AppConfig'
import * as MongoDriver from 'server/actions/MongoDriver'
import { errors } from 'utils/constants/errors'
import { getAppConfig } from 'server/actions/AppConfig'

// @route GET api/appConfigs/[appConfigId] - Returns a single AppConfig object given by a appConfigId - Private
// @route PUT api/appConfigs/[appConfigId] - Updates an existing AppConfig object (identified by appConfigId) with a new AppConfig object - Private
// @route DELETE api/appConfigs/[appConfigId] - Deletes a single AppConfig object (identified by appConfigId) - Private
export default async function appConfigHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)
    apiObjectIdValidation(req?.query?.appConfigId as string)
    const appConfigId = req.query.appConfigId as string

    switch (req.method) {
      case 'GET': {
        const config: AppConfigResponse = await getAppConfig(appConfigId)

        return res.status(200).json({
          success: true,
          payload: config,
        })
      }
      case 'PUT': {
        apiAppConfigValidation(req.body, 'PUT')
        const updatedAppConfig: AppConfigPutRequest = req.body

        await MongoDriver.updateEntity(
          AppConfigSchema,
          appConfigId,
          updatedAppConfig
        )

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      case 'DELETE': {
        await MongoDriver.deleteEntity(AppConfigSchema, appConfigId)

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
