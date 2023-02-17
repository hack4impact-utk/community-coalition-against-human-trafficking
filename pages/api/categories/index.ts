import { NextApiRequest, NextApiResponse } from 'next'
import { createCategory, getCategories } from '../../../server/actions/Category'
import { ApiError, Category } from '../../../utils/types'
import { serverAuth } from '../../../utils/auth'
import { apiCategoryValidation } from '../../../utils/apiValidators'

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
        const categories = await getCategories()
        const resStatus = categories.length ? 200 : 204
        return res.status(resStatus).json({
          success: true,
          payload: categories,
        })
      }
      case 'POST': {
        apiCategoryValidation(req.body)
        const category = req.body as Category
        await createCategory(category)

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
