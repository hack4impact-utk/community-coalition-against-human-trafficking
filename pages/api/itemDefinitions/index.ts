import { NextApiRequest, NextApiResponse } from 'next'
import {
  ApiError,
  ItemDefinitionPostRequest,
  ItemDefinitionResponse,
} from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiItemDefinitionValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import ItemDefinitionSchema from 'server/models/ItemDefinition'
import { getItemDefinitions } from 'server/actions/ItemDefinition'
import { errors } from 'utils/constants/errors'

// @route GET api/itemDefintions - Returns a list of all itemDefintions in the database - Private
// @route POST /api/itemDefintions - Create a itemDefinition from request body - Private
export default async function itemDefinitionsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    switch (req.method) {
      case 'GET': {
        const items: ItemDefinitionResponse[] = await getItemDefinitions()
        const resStatus = items.length ? 200 : 204
        return res.status(resStatus).json({
          success: true,
          payload: items,
        })
      }
      case 'POST': {
        apiItemDefinitionValidation(req.body, 'POST')
        const itemDefinition: ItemDefinitionPostRequest = req.body
        const response = await MongoDriver.createEntity(
          ItemDefinitionSchema,
          itemDefinition
        )

        return res.status(201).json({
          success: true,
          payload: response._id,
        })
      }
      default: {
        throw new ApiError(405, errors.invalidReqMethod)
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
