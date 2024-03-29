import { NextApiRequest, NextApiResponse } from 'next'
import { setAssignee } from 'server/actions/InventoryItems'
import { ApiError } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiObjectIdValidation } from 'utils/apiValidators'
import { logAssignment } from 'utils/log'

// @route PUT api/itemDefintions/[inventoryItemId]/assign - Assigns an inventory item to a user - Private
export default async function inventoryItemHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    const { user: assigningUser } = await serverAuth(req, res)

    apiObjectIdValidation(req?.query?.inventoryItemId as string)
    const inventoryItemId = req.query.inventoryItemId as string
    switch (req.method) {
      case 'PUT': {
        const { assignee: assigneeId } = req.body
        const item = await setAssignee(inventoryItemId, assigneeId)

        // log the action
        logAssignment(assigningUser, assigneeId, item)

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
