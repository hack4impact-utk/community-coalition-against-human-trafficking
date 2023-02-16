import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from '../../../utils/types'
import { serverAuth } from '../../../utils/auth'
import { getItemDefinitions } from '../../../server/actions/ItemDefinitions'

// @route GET api/categories - Returns a list of all Categories in the database - Private
// @route POST /api/categories - Create a category from request body - Private
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    switch (req.method) {
      case 'GET': {
        const item = await getItemDefinitions()

        return res.status(200).json({
          success: true,
          payload: item,
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
