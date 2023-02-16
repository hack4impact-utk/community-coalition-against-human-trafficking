import { NextApiRequest, NextApiResponse } from 'next'
import {
  getItemDefinition,
  updateItemDefinition,
  deleteItemDefinition,
} from '../../../server/actions/ItemDefinition'
import { ApiError, ItemDefinition } from '../../../utils/types'
import { serverAuth } from '../../../utils/auth'

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

    // ensure that itemDefinitionId is passed in
    if (!req || !req.query || !req.query.itemDefinitionId) {
      throw new ApiError(400, 'Bad Request')
    }

    const itemDefinitionId = req.query.itemDefinitionId as string
    switch (req.method) {
      case 'GET': {
        const itemDefinition = await getItemDefinition(itemDefinitionId)

        return res.status(200).json({
          success: true,
          payload: itemDefinition,
        })
      }
      case 'PUT': {
        const updatedItemDefinition = req.body as ItemDefinition
        await updateItemDefinition(itemDefinitionId, updatedItemDefinition)

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      case 'DELETE': {
        await deleteItemDefinition(itemDefinitionId)

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
