import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, LogResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { getFilteredLogs } from 'server/actions/Logs'
import { createLogsCsvAsString } from 'utils/csv'

// @route GET api/logs/csv - Returns a list of all logs in the database - Private
export default async function logsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)
    const { search, category, startDate, endDate, internal, sort, order } =
      req.query

    switch (req.method) {
      case 'GET': {
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"')
        const logs = await getFilteredLogs(
          sort as string,
          order as string,
          (search as string) || undefined,
          (category as string) || undefined,
          (startDate as string) || undefined,
          (endDate as string) || undefined,
          !!internal
        )
        const csvString = createLogsCsvAsString(logs as LogResponse[])
        return res.status(200).send(csvString)
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
