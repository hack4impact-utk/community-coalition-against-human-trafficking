import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, AttributePostRequest, AttributeResponse } from 'utils/types'
import { apiAttributeValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import AttributeSchema from 'server/models/Attribute'
import { serverAuth } from 'utils/auth'
import constants from 'utils/constants'

// @route GET api/attributes - Returns a list of all Attributes in the database - Private
// @route POST api/attributes - Create an Attribute from request body - Private
export default async function attributesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    switch (req.method) {
      case 'GET': {
        const attributes: AttributeResponse[] = await MongoDriver.getEntities(
          AttributeSchema
        )
        const resStatus = attributes.length ? 200 : 204
        return res.status(resStatus).json({
          succcess: true,
          payload: attributes,
        })
      }
      case 'POST': {
        apiAttributeValidation(req.body, 'POST')
        const attribute: AttributePostRequest = req.body
        const response: AttributeResponse = await MongoDriver.createEntity(
          AttributeSchema,
          attribute
        )

        return res.status(201).json({
          success: true,
          payload: response._id,
        })
      }
      default: {
        throw new ApiError(405, constants.errors.invalidReqMethod)
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
