import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, CheckInOutRequest, LogPostRequest } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { checkOutInventoryItem } from 'server/actions/InventoryItems'
import { createLog } from 'server/actions/Logs'

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
        const checkInOutRequest: CheckInOutRequest = req.body
        const quantity = Number(checkInOutRequest.quantityDelta)
        const response = await checkOutInventoryItem(
          checkInOutRequest.inventoryItem,
          quantity
        )

        const log: LogPostRequest = {
          staff: checkInOutRequest.staff,
          date: checkInOutRequest.date,
          quantityDelta: checkInOutRequest.quantityDelta * -1,
          item: response.toString(),
        }

        await createLog(log)

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
