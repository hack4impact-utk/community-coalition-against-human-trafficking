import { NextApiRequest, NextApiResponse } from 'next'
import { getItemDefinition } from 'server/actions/ItemDefinition'
import { ApiError, ItemDefinitionRequest, ItemDefinitionResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import {
  apiItemDefinitionValidation,
  apiObjectIdValidation,
} from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import ItemDefinitionSchema from 'server/models/ItemDefinition'

// @route GET api/itemDefintions/[itemDefinitionId] - Returns a single ItemDefinition object given a itemDefinitionId - Private
// @route PUT api/users/[itemDefinitionId] - Updates an existing ItemDefinition object (identified by itemDefinitionId) with a new ItemDefinition object - Private
// @route DELETE api/users/[itemDefinitionId] - Deletes a single ItemDefinition object (identified by itemDefinitionId) - Private
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    apiObjectIdValidation(req?.query?.itemDefinitionId as string)
    const itemDefinitionId = req.query.itemDefinitionId as string
    switch (req.method) {
      case 'GET': {
        const itemDefinition: ItemDefinitionResponse = await MongoDriver.getEntity(ItemDefinitionSchema, itemDefinitionId)

        return res.status(200).json({
          success: true,
          payload: itemDefinition,
        })
      }
      case 'PUT': {
        apiItemDefinitionValidation(req.body)
        const updatedItemDefinition = req.body as ItemDefinitionRequest
        await MongoDriver.updateEntity(
          ItemDefinitionSchema,
          itemDefinitionId,
          updatedItemDefinition
        )

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      case 'DELETE': {
        await MongoDriver.deleteEntity(ItemDefinitionSchema, itemDefinitionId)

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
