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
import { errors } from 'utils/constants/errors'

// @route GET api/itemDefintions/[itemDefinitionId]/attributeValues - Returns an array of text/number attribute values of existing inventoryItems of the given itemDefinition - Private
export default async function itemDefinitionAttributeValuesHandler(
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
        const itemDefinition: ItemDefinitionResponse = await getItemDefinition(
          itemDefinitionId
        )

        return res.status(200).json({
          success: true,
          payload: itemDefinition,
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
