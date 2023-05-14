import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, ItemDefinitionResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { getPresentItemDefinitions } from 'server/actions/ItemDefinition'
import { errors } from 'utils/constants/errors'

// @route GET api/itemDefintions/present - Returns a list of all itemDefintions in the database that have some stock in the warehouse - Private
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
        const resStatus = items.length ? 200 : 204
        return res.status(resStatus).json({
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
