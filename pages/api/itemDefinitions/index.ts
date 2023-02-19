import { NextApiRequest, NextApiResponse } from 'next'
import { getItemDefinitions } from '../../../server/actions/ItemDefinition'
import { ApiError, ItemDefinition } from '../../../utils/types'
import { serverAuth } from '../../../utils/auth'
import { apiItemDefinitionValidation } from '../../../utils/apiValidators'
import * as MongoDriver from '../../../server/actions/MongoDriver'
import ItemDefinitionSchema from '../../../server/models/Category'

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
        const items = await getItemDefinitions()
        const resStatus = items.length ? 200 : 204
        return res.status(resStatus).json({
          success: true,
          payload: items,
        })
      }
      case 'POST': {
        apiItemDefinitionValidation(req.body)
        const itemDefinition = req.body as ItemDefinition
        let itemDefinitionId = await MongoDriver.createEntity(
          ItemDefinitionSchema,
          itemDefinition
        )

        return res.status(200).json({
          success: true,
          payload: itemDefinitionId,
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
