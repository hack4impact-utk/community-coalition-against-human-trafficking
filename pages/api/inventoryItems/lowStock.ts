import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, ItemDefinitionResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { getPaginatedInventoryItems } from 'server/actions/InventoryItems'
import { inventoryPaginationDefaults } from 'utils/constants'

const sortPathMap = {
  name: 'itemDefinition.name',
  category: 'itemDefinition.category.name',
  quantity: 'quantity',
  assignee: 'assignee.name',
}

// @route GET api/inventoryItems/lowStock - Returns a list of all the inventoryItems in low stock - Private
export default async function inventoryItemsLowStockHandler(
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
              inventoryPaginationDefaults.orderBy
          ],
          (order as string) || inventoryPaginationDefaults.order,
          search as string,
          category as string
        )
        items.data = items.data.filter(
          (item) =>
            item.quantity <
            (item.itemDefinition as ItemDefinitionResponse).lowStockThreshold
        )
        const resStatus = 200
        return res.status(resStatus).json({
          success: true,
          payload: items,
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
