import { NextApiRequest, NextApiResponse } from 'next'
import { apiObjectIdValidation, apiUserValidation } from 'utils/apiValidators'
import { userEndpointServerAuth } from 'utils/auth'
import { ApiError, UserPutRequest, UserResponse } from 'utils/types'
import * as MongoDriver from 'server/actions/MongoDriver'
import UserSchema from 'server/models/User'

// @route   GET api/users/[userId] - Returns a single User object for user with userId - Private
// @route   DELETE api/users/[userId] - Deletes a single User object for user with userId - Private
// @route   PUT api/users/[userId] - Updates a the existing User object with _id of userId with the new user - Private
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    apiObjectIdValidation(req?.query?.userId as string)

    // get user to verify identity
    const userId = req.query.userId as string
    const user: UserResponse = await MongoDriver.getEntity(UserSchema, userId)

    await userEndpointServerAuth(req, res, user.email)

    switch (req.method) {
      case 'GET': {
        return res.status(200).json({
          success: true,
          payload: user,
        })
      }
      case 'DELETE': {
        await MongoDriver.deleteEntity(UserSchema, userId)

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      case 'PUT': {
        apiUserValidation(req.body)
        const updatedUser: UserPutRequest = req.body
        await MongoDriver.updateEntity(UserSchema, userId, updatedUser)

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
