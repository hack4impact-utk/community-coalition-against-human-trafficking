import { NextApiRequest, NextApiResponse } from 'next'
import { getLog } from 'server/actions/Logs'
import { ApiError, LogPutRequest } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { apiLogValidation, apiObjectIdValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import LogSchema from 'server/models/Log'

// @route GET api/logs/[logId] - Returns a single Log object given a logId - Private
// @route PUT api/logs/[logId] - Updates an existing Log object (identified by logId) with a new Log object - Private
// @route DELETE api/logs/[logId] - Deletes a single Log object (identified by logId) - Private
export default async function logHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    apiObjectIdValidation(req?.query?.logId as string)
    const logId = req.query.logId as string
    switch (req.method) {
      case 'GET': {
        const log = await getLog(logId)

        return res.status(200).json({
          success: true,
          payload: log,
        })
      }
      case 'PUT': {
        apiLogValidation(req.body)
        const updatedLog: LogPutRequest = req.body
        await MongoDriver.updateEntity(LogSchema, logId, updatedLog)

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      case 'DELETE': {
        await MongoDriver.deleteEntity(LogSchema, logId)

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
    console.log(e)
    if (e instanceof ApiError) {
      return res.status(e.statusCode).json({
        success: false,
        message: e.message,
      })
    }
  }
}
