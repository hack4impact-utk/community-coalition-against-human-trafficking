import { NextApiRequest, NextApiResponse } from 'next'
import { getItemDefinition } from 'server/actions/ItemDefinition'
import {
  ApiError,
  ItemDefinitionPutRequest,
  ItemDefinitionResponse,
} from 'utils/types'
import { serverAuth } from 'utils/auth'
import {
  apiItemDefinitionValidation,
  apiObjectIdValidation,
} from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import ItemDefinitionSchema from 'server/models/ItemDefinition'
import { errors } from 'utils/constants/errors'
import { logSoftDeletion } from 'utils/log'

// @route GET api/itemDefintions/[itemDefinitionId] - Returns a single ItemDefinition object given a itemDefinitionId - Private
// @route PUT api/users/[itemDefinitionId] - Updates an existing ItemDefinition object (identified by itemDefinitionId) with a new ItemDefinition object - Private
// @route DELETE api/users/[itemDefinitionId] - Deletes a single ItemDefinition object (identified by itemDefinitionId) - Private
export default async function itemDefinitionHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    const { user } = await serverAuth(req, res)

    apiObjectIdValidation(req?.query?.itemDefinitionId as string)
    const itemDefinitionId = req.query.itemDefinitionId as string
    switch (req.method) {
      case 'GET': {
        const itemDefinition: ItemDefinitionResponse = await getItemDefinition(
          itemDefinitionId
        )

        return res.status(200).json({
          success: true,
          payload: itemDefinition,
        })
      }
      case 'PUT': {
        apiItemDefinitionValidation(req.body, 'PUT')
        const updatedItemDefinition: ItemDefinitionPutRequest = req.body
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
        const itemDef = await MongoDriver.softDeleteEntity(
          ItemDefinitionSchema,
          itemDefinitionId
        )

        // log action
        logSoftDeletion(user, itemDef)

        return res.status(200).json({
          success: true,
          payload: {},
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
