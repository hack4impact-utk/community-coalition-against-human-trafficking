import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, LogRequest } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { getLogs } from 'server/actions/Logs'

// @route GET api/logs - Returns a list of all logs in the database - Private
// @route POST /api/logs - Create a logs from request body - Private
export default async function logsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    switch (req.method) {
      case 'GET': {
        const logs = await getLogs()
        const resStatus = logs.length ? 200 : 204
        return res.status(resStatus).json({
          success: true,
          payload: logs,
        })
      }
      case 'POST': {
        apiLogValidation(req.body)
        const log: LogRequest = req.body
        const response = await MongoDriver.createEntity(LogSchema, log)

        return res.status(201).json({
          success: true,
          payload: response._id,
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
