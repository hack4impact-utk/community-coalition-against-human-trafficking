import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, ItemDefinitionResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { getPresentItemDefinitions } from 'server/actions/ItemDefinition'
import { errors } from 'utils/constants/errors'

// @route GET api/itemDefintions/present - Returns a list of all itemDefintions in the database that
// have some stock in the warehouse and are not internal - Private
export default async function presentItemDefinitionsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    switch (req.method) {
      case 'GET': {
        const items: ItemDefinitionResponse[] =
          await getPresentItemDefinitions()
        return res.status(200).json({
          success: true,
          payload: items,
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
