import { NextApiRequest, NextApiResponse } from 'next'
import {
  createAttribute,
  getAttribute,
  getAttributes,
} from '../../../server/actions/Attributes'
import { ApiError, Attribute } from '../../../utils/types'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

// @route GET api/attributes - Returns a list of all Attributes in the database - Private
// @route POST api/attributes - Create an Attribute from request body - Private
export default async function hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
      throw new ApiError(401, 'You must be authenticated to make this request.')
    }

    switch (req.method) {
      case 'GET': {
        const attributes = await getAttributes()

        return res.status(200).json({
          succcess: true,
          payload: attributes,
        })
      }
      case 'POST': {
        const attribute = req.body as Attribute
        await createAttribute(attribute)

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
    if (e instanceof ApiError) {
      return res.status(e.statusCode).json({
        success: false,
        message: e.message,
      })
    }
  }
}
