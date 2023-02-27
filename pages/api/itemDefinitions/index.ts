import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, InventoryItem, ItemDefinition } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiItemDefinitionValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import ItemDefinitionSchema from 'server/models/ItemDefinition'
import { getItemDefinitions } from 'server/actions/ItemDefinition'
import {
  checkInInventoryItem,
  checkOutInventoryItem,
} from 'server/actions/InventoryItems'

// @route GET api/itemDefintions - Returns a list of all itemDefintions in the database - Private
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
        // const items = await getItemDefinitions()
        // const resStatus = items.length ? 200 : 204
        // return res.status(resStatus).json({
        //   success: true,
        //   payload: items,
        // })
        const item: InventoryItem = {
          itemDefinition: '63edadfb566dfd57bfdb5456',
          quantity: 0,
          assignee: '63fa71d1d7f7d06fb99723a1',
          attributes: [
            { attribute: '63f1be76e4c470019adec84c', value: 3 },
            { attribute: '63fc0555a3ca65132654a655', value: 3 },
          ],
        }

        // const result = await MongoDriver.getEntities(InventoryItemSchema)
        const result = checkInInventoryItem(item, 2)
        return res.status(200).json({
          success: true,
          payload: result,
        })
      }
      case 'POST': {
        apiItemDefinitionValidation(req.body)
        const itemDefinition = req.body as ItemDefinition
        const response = await MongoDriver.createEntity(
          ItemDefinitionSchema,
          itemDefinition
        )

        return res.status(201).json({
          success: true,
          payload: response.id,
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
