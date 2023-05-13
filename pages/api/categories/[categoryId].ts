import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, CategoryPutRequest, CategoryResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import {
  apiCategoryValidation,
  apiObjectIdValidation,
} from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import CategorySchema from 'server/models/Category'
import { errors } from 'utils/constants/errors'

// @route GET api/categories/[categoryId] - Returns a single Category object given a categoryId - Private
// @route PUT api/users/[categoryId] - Updates an existing Category object (identified by categoryId) with a new Category object - Private
// @route DELETE api/users/[categoryId] - Deletes a single Category object (identified by categoryId) - Private
export default async function categoryHandler(
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
        const category: CategoryResponse = await MongoDriver.getEntity(
          CategorySchema,
          categoryId
        )

        return res.status(200).json({
          success: true,
          payload: category,
        })
      }
      case 'PUT': {
        apiCategoryValidation(req.body, 'PUT')
        const updatedCategory: CategoryPutRequest = req.body
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
        await MongoDriver.softDeleteEntity(CategorySchema, categoryId)

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      default: {
        throw new ApiError(405, errors.invalidReqMethod)
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
