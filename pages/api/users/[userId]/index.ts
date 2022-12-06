import { NextApiRequest, NextApiResponse } from 'next'
import {
  deleteUser,
  getUser,
  updateUser,
} from '../../../../server/actions/User'
import { serverAuth } from '../../../../utils/auth'
import { ApiError, User } from '../../../../utils/types'

// @route   GET api/users/[userId] - Returns a single User object for user with userId - Private
// @route   DELETE api/users/[userId] - Deletes a single User object for user with userId - Private
// @route   PUT api/users/[userId] - Updates a the existing User object with _id of userId with the new user - Private
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure that userId is passed
    if (!req || !req.query || !req.query.userId) {
      throw new ApiError(400, 'Bad Request')
    }

    const user = await getUser(req.query.userId as string)

    switch (req.method) {
      case 'GET': {
        const session = await serverAuth(req, res, user?.email)
        console.log(session)

        return res.status(200).json({
          success: true,
          payload: user,
        })
      }
      case 'DELETE': {
        await serverAuth(req, res, user?.email)
        await deleteUser(req.query.userId as string)
        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      case 'PUT': {
        await serverAuth(req, res, user?.email)
        const updatedUser = JSON.parse(req.body) as User
        await updateUser(req.query.userId as string, updatedUser)
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
