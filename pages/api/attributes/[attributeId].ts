import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, AttributePutRequest, AttributeResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import {
  apiAttributeValidation,
  apiObjectIdValidation,
} from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import AttributeSchema from 'server/models/Attribute'

// @route GET api/attributes/[attributeId] - Returns a single Attribute object given by a attributeId - Private
// @route PUT api/attributes/[attributeId] - Updates an existing Attribute object (identified by attributeId) with a new Attribute object - Private
// @route DELETE api/attributes/[attributeId] - Deletes a single Atttribute object (identified by attributeId) - Private
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)
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
          succcess: true,
          payload: {},
        })
      }
      case 'DELETE': {
        await MongoDriver.deleteEntity(AttributeSchema, attributeId)

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      default: {
        throw new ApiError(405, 'Method Not Allowed')
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
