import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, LogResponse } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { getFilteredLogs } from 'server/actions/Logs'
import { createLogsCsvAsString } from 'utils/csv'
import { historyPaginationDefaults } from 'utils/constants'

// @route GET api/logs/export - Returns a CSV of the logs filtered and sorted by the query parameters - Private
export default async function logsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)
    const { search, category, startDate, endDate, internal } = req.query

    switch (req.method) {
      case 'GET': {
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"')
        const logs = await getFilteredLogs(
          historyPaginationDefaults.orderBy,
          historyPaginationDefaults.order,
          search as string,
          category as string,
          startDate as string,
          endDate as string,
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
