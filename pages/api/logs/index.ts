import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError, LogRequest } from 'utils/types'
import { serverAuth } from 'utils/auth'
import { getPaginatedLogs } from 'server/actions/Logs'
import { apiLogValidation } from 'utils/apiValidators'
import * as MongoDriver from 'server/actions/MongoDriver'
import LogSchema from 'server/models/Log'

const sortPathMap = {
  date: 'date',
  item: 'item.itemDefinition.name',
  category: 'item.itemDefinition.category.name',
  assignee: 'item.assignee.name',
  staff: 'staff.name',
  quantityDelta: 'quantityDelta',
}

// @route GET api/logs - Returns a list of all logs in the database - Private
// @route POST /api/logs - Create a logs from request body - Private
export default async function logsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)
    const {
      sort,
      order,
      limit,
      page,
      search,
      category,
      startDate,
      endDate,
      internal,
    } = req.query

    switch (req.method) {
      case 'GET': {
        const logs = await getPaginatedLogs(
          Number(page || 0),
          Number(limit || 10),
          sortPathMap[sort as keyof typeof sortPathMap] || 'date',
          (order as string) || 'desc',
          (search as string) || undefined,
          (category as string) || undefined,
          (startDate as string) || undefined,
          (endDate as string) || undefined,
          !!internal
        )
        const resStatus = 200
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
