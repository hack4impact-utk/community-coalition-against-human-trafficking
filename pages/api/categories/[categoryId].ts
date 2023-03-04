import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, Category, CategoryRequest, CategoryResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import {
  apiCategoryValidation,
  apiObjectIdValidation,
} from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import CategorySchema from 'server/models/Category'

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

    apiObjectIdValidation(req?.query?.categoryId as string)
    const categoryId = req.query.categoryId as string

    switch (req.method) {
      case 'GET': {
        const category: CategoryResponse = await MongoDriver.getEntity(CategorySchema, categoryId)

        return res.status(200).json({
          success: true,
          payload: category,
        })
      }
      case 'PUT': {
        apiCategoryValidation(req.body)
        const updatedCategory = req.body as CategoryRequest
        await MongoDriver.updateEntity(
          CategorySchema,
          categoryId,
          updatedCategory
        )

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      case 'DELETE': {
        await MongoDriver.deleteEntity(CategorySchema, categoryId)

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
