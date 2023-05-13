import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, InventoryItemPostRequest } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { getPaginatedInventoryItems } from 'server/actions/InventoryItems'
import * as MongoDriver from 'server/actions/MongoDriver'
import InventoryItemSchema from 'server/models/InventoryItem'
import { apiInventoryItemValidation } from 'utils/apiValidators'
import { inventoryPaginationDefaults } from 'utils/constants'

const sortPathMap = {
  name: 'itemDefinition.name',
  category: 'itemDefinition.category.name',
  quantity: 'quantity',
  assignee: 'assignee.name',
}

// @route GET api/inventoryItems - Returns a list of all inventoryItems in the database - Private
// @route POST /api/inventoryItems - Create a inventoryItems from request body - Private
export default async function inventoryItemsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)
    const { orderBy, order, limit, page, search, category } = req.query

    switch (req.method) {
      case 'GET': {
        const items = await getPaginatedInventoryItems(
          Number(page || inventoryPaginationDefaults.page),
          Number(limit || inventoryPaginationDefaults.limit),
          sortPathMap[
            (orderBy as keyof typeof sortPathMap) ||
              inventoryPaginationDefaults.sort
          ],
          (order as string) || inventoryPaginationDefaults.order,
          search as string,
          category as string
        )
        return res.status(200).json({
          success: true,
          payload: items,
        })
      }
      case 'POST': {
        apiInventoryItemValidation(req.body)
        const inventoryItem: InventoryItemPostRequest = req.body
        const response = await MongoDriver.createEntity(
          InventoryItemSchema,
          inventoryItem
        )

        return res.status(201).json({
          success: true,
          payload: response._id,
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
