import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, AttributePostRequest, AttributeResponse } from 'utils/types'
import { apiAttributeValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import AttributeSchema from 'server/models/Attribute'
import { serverAuth } from 'utils/auth'
import { errors } from 'utils/constants/errors'

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
        const attributes: AttributeResponse[] =
          await MongoDriver.findEntitiesByQuery(AttributeSchema, {
            softDelete: { $exists: false },
          })
        return res.status(200).json({
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
