import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, InventoryItem } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { checkOutInventoryItem } from 'server/actions/InventoryItems'

// @route POST /api/inventoryItems/checkOut - Checks out an inventory item - Private
export default async function inventoryItemsCheckOutHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    switch (req.method) {
      case 'POST': {
        const inventoryItem: Partial<InventoryItem> = req.body
        const { quantity } = req.query
        await checkOutInventoryItem(inventoryItem, Number(quantity))

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