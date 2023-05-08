import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, ItemDefinitionResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { getInventoryItems } from 'server/actions/InventoryItems'

// @route GET api/inventoryItems/lowStock - Returns a list of all the inventoryItems in low stock - Private
export default async function inventoryItemsLowStockHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    switch (req.method) {
      case 'GET': {
        let items = await getInventoryItems()
        items = items.filter(
          (item) =>
            item.quantity <
            (item.itemDefinition as ItemDefinitionResponse).lowStockThreshold
        )
        const resStatus = items.length ? 200 : 204
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
