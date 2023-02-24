import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, ItemDefinition, InventoryItem } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiItemDefinitionValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import ItemDefinitionSchema from 'server/models/ItemDefinition'
import InventoryItemSchema from 'server/models/InventoryItem'
import { getItemDefinitions } from 'server/actions/ItemDefinition'
import { checkInInventoryItem } from 'server/actions/InventoryItems'

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
        //        return res.status(resStatus).json({
        //         success: true,
        //        payload: items,
        //     })
        const item: Partial<InventoryItem> = {
          itemDefinition: '63edadfb566dfd57bfdb5456',
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
