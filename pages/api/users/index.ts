import { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from '../../../server/actions/User'
import { ApiError, User } from '../../../utils/types'

// @route   POST /api/users - Create a user from request body. - Public
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      const user = req.body as User
      await createUser(user)

      return res.status(200).json({
        success: true,
        payload: {},
      })
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
