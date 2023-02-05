import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCategory,
  updateCategory,
  deleteCategory,
} from '../../../server/actions/Category'
import { ApiError, Category } from '../../../utils/types'

// @route GET api/categories/[categoryId] - Returns a single Category object given a categoryId - Public
// @route PUT api/users/[categoryId] - Updates an existing Category object (identified by categoryId) with a new Category object - Public
// @route DELETE api/users/[categoryId] - Deletes a single Category object (identified by categoryId) - Public
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //ensure that categoryId is passed in
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
