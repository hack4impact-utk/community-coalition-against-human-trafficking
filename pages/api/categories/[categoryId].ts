import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCategory,
  updateCategory,
  deleteCategory,
} from '../../../server/actions/Category'
import { ApiError, Category } from '../../../utils/types'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

// @route GET api/categories/[categoryId] - Returns a single Category object given a categoryId - Private
// @route PUT api/users/[categoryId] - Updates an existing Category object (identified by categoryId) with a new Category object - Private
// @route DELETE api/users/[categoryId] - Deletes a single Category object (identified by categoryId) - Private
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
      throw new ApiError(401, 'You must be authenticated to make this request.')
    }

    // ensure that categoryId is passed in
    if (!req || !req.query || !req.query.categoryId) {
      throw new ApiError(400, 'Bad Request')
    }

    const categoryId = req.query.categoryId as string
    switch (req.method) {
      case 'GET': {
        const category = await getCategory(categoryId)

        return res.status(200).json({
          success: true,
          payload: category,
        })
      }
      case 'PUT': {
        const updatedCategory = req.body as Category
        await updateCategory(categoryId, updatedCategory)

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      case 'DELETE': {
        await deleteCategory(categoryId)

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
