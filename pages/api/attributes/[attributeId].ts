import { NextApiRequest, NextApiResponse } from 'next'
import {
  ApiError,
  AppConfigPutRequest,
  AppConfigResponse,
  AttributePutRequest,
  AttributeResponse,
} from 'utils/types'
import { serverAuth } from 'utils/auth'
import {
  apiAttributeValidation,
  apiObjectIdValidation,
} from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import AttributeSchema from 'server/models/Attribute'
import { errors } from 'utils/constants/errors'
import { getAppConfigs } from 'server/actions/AppConfig'
import AppConfigSchema from 'server/models/AppConfig'
import { logSoftDeletion } from 'utils/log'

// @route GET api/attributes/[attributeId] - Returns a single Attribute object given by a attributeId - Private
// @route PUT api/attributes/[attributeId] - Updates an existing Attribute object (identified by attributeId) with a new Attribute object - Private
// @route DELETE api/attributes/[attributeId] - Deletes a single Atttribute object (identified by attributeId) - Private
export default async function attributeHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    const { user } = await serverAuth(req, res)
    apiObjectIdValidation(req?.query?.attributeId as string)
    const attributeId = req.query.attributeId as string

    switch (req.method) {
      case 'GET': {
        const attribute: AttributeResponse = await MongoDriver.getEntity(
          AttributeSchema,
          attributeId
        )

        return res.status(200).json({
          success: true,
          payload: attribute,
        })
      }
      case 'PUT': {
        apiAttributeValidation(req.body, 'PUT')
        const updatedAttribute: AttributePutRequest = req.body

        await MongoDriver.updateEntity(
          AttributeSchema,
          attributeId,
          updatedAttribute
        )

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      case 'DELETE': {
        const attribute = await MongoDriver.softDeleteEntity(
          AttributeSchema,
          attributeId
        )

        // log action
        logSoftDeletion(user, attribute)

        // if the attribute is in the appConfigs.defaultAttributes array, remove it
        const appConfigs: AppConfigResponse = (await getAppConfigs())[0]
        const newDefaultAttributes = appConfigs.defaultAttributes.filter(
          (attr) => attr._id != attributeId
        )

        if (
          newDefaultAttributes.length !== appConfigs.defaultAttributes.length
        ) {
          const updatedAppConfig: AppConfigPutRequest = {
            ...appConfigs,
            defaultAttributes: newDefaultAttributes.map((attr) => attr._id),
          }

          await MongoDriver.updateEntity(
            AppConfigSchema,
            appConfigs._id,
            updatedAppConfig
          )
        }

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
