import { NextApiRequest, NextApiResponse } from 'next'
import {
  createAttribute,
  getAttribute,
  getAttributes,
} from '../../../server/actions/Attributes'
import { ApiError, Attribute } from '../../../utils/types'
import { serverAuth } from '../../../utils/auth'

// @route GET api/attributes - Returns a list of all Attributes in the database - Private
// @route POST api/attributes - Create an Attribute from request body - Private
export default async function hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    switch (req.method) {
      case 'GET': {
        const attributes = await getAttributes()
        const resStatus = attributes.length ? 200 : 204
        return res.status(resStatus).json({
          succcess: true,
          payload: attributes,
        })
      }
      case 'POST': {
        const attribute: Attribute = req.body
        console.log(attribute)
        await createAttribute(attribute)

        return res.status(201).json({
          success: true,
          payload: {},
        })
      }
      default: {
        throw new ApiError(405, 'Method Not Allowed')
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
