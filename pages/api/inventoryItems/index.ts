import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, InventoryItem } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiInventoryItemValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import InventoryItemSchema from 'server/models/InventoryItem'
import { getInventoryItems } from 'server/actions/InventoryItems'

// @route GET api/inventoryItems - Returns a list of all inventoryItems in the database - Private
// @route POST /api/itemDefintions - Create a itemDefinition from request body - Private
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    switch (req.method) {
      case 'GET': {
        const items = await getInventoryItems()
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
