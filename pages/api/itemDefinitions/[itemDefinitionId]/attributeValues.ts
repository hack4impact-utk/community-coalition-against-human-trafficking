import { NextApiRequest, NextApiResponse } from 'next'
import { getItemDefinitionAttributeValues } from 'server/actions/ItemDefinition'
import {
  ApiError,
  InventoryItemExistingAttributeValuesResponse,
} from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiObjectIdValidation } from 'utils/apiValidators'
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
        const response: InventoryItemExistingAttributeValuesResponse[] =
          await getItemDefinitionAttributeValues(itemDefinitionId)

        const resStatus = response.length ? 200 : 204
        return res.status(resStatus).json({
          success: true,
          payload: response,
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
