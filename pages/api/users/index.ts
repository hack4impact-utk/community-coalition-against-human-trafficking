import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, UserRequest, UserResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiUserValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import UserSchema from 'server/models/User'

// @route   POST /api/users - Create a user from request body. - Public
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      apiUserValidation(req.body)
      const user = req.body as UserRequest
      const response = await MongoDriver.createEntity(UserSchema, user)

      return res.status(201).json({
        success: true,
        payload: response.id,
      })
    } else if (req.method === 'GET') {
      await serverAuth(req, res)
      const users: UserResponse[] = await MongoDriver.getEntities(UserSchema)
      const resStatus = users.length ? 200 : 204
      return res.status(resStatus).json({
        success: true,
        payload: users,
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
