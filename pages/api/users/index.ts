import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, UserPostRequest, UserResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiUserValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import UserSchema from 'server/models/User'
import { errors } from 'utils/constants/errors'

// @route   POST /api/users - Create a user from request body. - Public
export default async function usersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'POST':
        apiUserValidation(req.body, 'POST')
        const user: UserPostRequest = req.body
        const response: UserResponse = await MongoDriver.createEntity(
          UserSchema,
          user
        )

        return res.status(201).json({
          success: true,
          payload: response._id,
        })
      case 'GET':
        await serverAuth(req, res)
        const users: UserResponse[] = await MongoDriver.getEntities(UserSchema)
        return res.status(200).json({
          success: true,
          payload: users,
        })
      default:
        throw new ApiError(405, errors.invalidReqMethod)
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
