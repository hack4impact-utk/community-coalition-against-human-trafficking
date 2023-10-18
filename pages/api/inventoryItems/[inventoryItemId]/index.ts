import { NextApiRequest, NextApiResponse } from 'next'
import { getInventoryItem } from 'server/actions/InventoryItems'
import { ApiError, InventoryItemPutRequest } from 'utils/types'
import { serverAuth } from 'utils/auth'
import {
  apiInventoryItemValidation,
  apiObjectIdValidation,
} from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import InventoryItemSchema from 'server/models/InventoryItem'
import { logInventoryItemSoftDeletion } from 'utils/log'

// @route GET api/itemDefintions/[inventoryItemId] - Returns a single InventoryItem object given a inventoryItemId - Private
// @route PUT api/itemDefintions/[inventoryItemId] - Updates an existing InventoryItem object (identified by inventoryItemId) with a new InventoryItem object - Private
// @route DELETE api/itemDefintions/[inventoryItemId] - Deletes a single InventoryItem object (identified by inventoryItemId) - Private
export default async function inventoryItemHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    const { user } = await serverAuth(req, res)

    apiObjectIdValidation(req?.query?.inventoryItemId as string)
    const inventoryItemId = req.query.inventoryItemId as string
    switch (req.method) {
      case 'GET': {
        const inventoryItem = await getInventoryItem(inventoryItemId)

        return res.status(200).json({
          success: true,
          payload: inventoryItem,
        })
      }
      case 'PUT': {
        apiInventoryItemValidation(req.body)
        const updatedInventoryItem: InventoryItemPutRequest = req.body
        await MongoDriver.updateEntity(
          InventoryItemSchema,
          inventoryItemId,
          updatedInventoryItem
        )

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      case 'DELETE': {
        const item = await MongoDriver.softDeleteEntity(
          InventoryItemSchema,
          inventoryItemId
        )

        // log action
        logInventoryItemSoftDeletion(user, item)

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
