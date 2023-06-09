import { NextApiRequest, NextApiResponse } from 'next'
import { setAssignee } from 'server/actions/InventoryItems'
import { ApiError } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiObjectIdValidation } from 'utils/apiValidators'

// @route GET api/itemDefintions/[inventoryItemId] - Returns a single InventoryItem object given a inventoryItemId - Private
// @route PUT api/itemDefintions/[inventoryItemId] - Updates an existing InventoryItem object (identified by inventoryItemId) with a new InventoryItem object - Private
// @route DELETE api/itemDefintions/[inventoryItemId] - Deletes a single InventoryItem object (identified by inventoryItemId) - Private
export default async function inventoryItemHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    apiObjectIdValidation(req?.query?.inventoryItemId as string)
    const inventoryItemId = req.query.inventoryItemId as string
    switch (req.method) {
      case 'PUT': {
        const { assignee } = req.body
        await setAssignee(inventoryItemId, assignee)

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
    console.error(e)
    if (e instanceof ApiError) {
      return res.status(e.statusCode).json({
        success: false,
        message: e.message,
      })
    }
  }
}
