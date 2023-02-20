import { NextApiRequest, NextApiResponse } from 'next'
import { createUser, getUsers } from '../../../server/actions/User'
import { ApiError, User } from '../../../utils/types'
import { serverAuth } from '../../../utils/auth'

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
    } else if (req.method === 'GET') {
      await serverAuth(req, res)
      const users = await getUsers()

      return res.status(200).json({
        success: true,
        payload: { users },
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
