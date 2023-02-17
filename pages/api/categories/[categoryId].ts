import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCategory,
  updateCategory,
  deleteCategory,
} from '../../../server/actions/Category'
import { ApiError, Category } from '../../../utils/types'
import { serverAuth } from '../../../utils/auth'
import {
  apiCategoryValidation,
  apiObjectIdValidation,
  apiRequestValidation,
} from '../../../utils/apiValidators'

// @route GET api/categories/[categoryId] - Returns a single Category object given a categoryId - Private
// @route PUT api/users/[categoryId] - Updates an existing Category object (identified by categoryId) with a new Category object - Private
// @route DELETE api/users/[categoryId] - Deletes a single Category object (identified by categoryId) - Private
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    apiRequestValidation(req)

    apiObjectIdValidation(req.query.categoryId)
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
        apiCategoryValidation(req.body)
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
