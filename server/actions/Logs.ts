import LogSchema from 'server/models/Log'
import * as MongoDriver from 'server/actions/MongoDriver'
import { PipelineStage } from 'mongoose'
import { apiLogValidation } from 'utils/apiValidators'
import { LogPostRequest } from 'utils/types'
import { LogResponse } from 'utils/types'

// aggregate pipeline does the following:
// looks up user _ids in log
// looks up inventoryItem _id in log
// looks up itemDefinition _id in inventoryItem
// looks up categroy _id in itemDefinition
// looks up attribute _ids in itemDefinition
// looks up attribute _ids in inventoryItem
const requestPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: 'inventoryItems',
      let: { inventoryItems: '$inventoryItems' },
      localField: 'item',
      foreignField: '_id',
      as: 'item',
      pipeline: [
        {
          $lookup: {
            from: 'itemDefinitions',
            let: { itemDefinitions: '$itemDefinitions' },
            pipeline: [
              {
                $lookup: {
                  from: 'categories',
                  localField: 'category',
                  foreignField: '_id',
                  as: 'category',
                },
              },
              {
                $lookup: {
                  from: 'attributes',
                  localField: 'attributes',
                  foreignField: '_id',
                  as: 'attributes',
                },
              },
              {
                $set: {
                  category: { $arrayElemAt: ['$category', 0] },
                },
              },
            ],
            localField: 'itemDefinition',
            foreignField: '_id',
            as: 'itemDefinition',
          },
        },
        // itemDefinition was being returned as an array, so extract it from the array
        {
          $set: {
            itemDefinition: { $arrayElemAt: ['$itemDefinition', 0] },
          },
        },
        // creates a temporary array of attribute documents called 'attributeDocs' containing all relevant attribute documents
        {
          $lookup: {
            from: 'attributes',
            localField: 'attributes.attribute',
            foreignField: '_id',
            as: 'attributeDocs',
          },
        },
        // the above lookup only gets the attribute docs from the 'attributes' collection.
        // It does not generate the inventoryItem attribute/value pairs.
        {
          $addFields: {
            // builds out the inventoryItem.attributes array from scratch
            attributes: {
              // for every attribute in inventoryItem.attributes object, create an attribute/value pair
              $map: {
                input: '$attributes',
                as: 'attr', // attribute from the inventoryItem.attributes array
                in: {
                  attribute: {
                    // find the corresponding document from the attributes collection with the same _id
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$attributeDocs',
                          as: 'doc', // document from the attributes collection
                          cond: { $eq: ['$$doc._id', '$$attr.attribute'] },
                        },
                      },
                      0,
                    ],
                  },
                  // set the inventoryItem.attributes[i].value to its original value
                  value: '$$attr.value',
                },
              },
            },
          },
        },
        // delete the temporary array of attribute documents
        {
          $project: {
            attributeDocs: 0,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'assignee',
            foreignField: '_id',
            as: 'assignee',
          },
        },
        {
          $set: {
            assignee: { $arrayElemAt: ['$assignee', 0] },
          },
        },
      ],
    },
  },
  {
    $set: {
      item: { $arrayElemAt: ['$item', 0] },
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'staff',
      foreignField: '_id',
      as: 'staff',
    },
  },
  {
    $set: {
      staff: { $arrayElemAt: ['$staff', 0] },
    },
  },

  // pull each item.attributes.attribute out of the array into its own document
  {
    $unwind: '$item.attributes',
  },

  // create a new field as "item.attributeSearch": `${attributeName}: ${attributeValue}`
  {
    $set: {
      'item.attributeSearch': {
        $concat: [
          '$item.attributes.attribute.name',
          ': ',
          { $toString: '$item.attributes.value' },
        ],
      },
    },
  },
]

function searchAggregate(search: string): PipelineStage {
  return {
    $match: {
      $or: [
        { 'item.itemDefinition.name': { $regex: search, $options: 'i' } },
        {
          'item.itemDefinition.category.name': {
            $regex: search,
            $options: 'i',
          },
        },
        { 'item.assignee.name': { $regex: search, $options: 'i' } },
        { 'staff.name': { $regex: search, $options: 'i' } },
        { 'staff.email': { $regex: search, $options: 'i' } },
      ],
    },
  }
}

function categorySearchAggregate(category: string): PipelineStage {
  return {
    $match: {
      'item.itemDefinition.category.name': category,
    },
  }
}

function startDateAggregate(startAfter: string): PipelineStage {
  return {
    $match: {
      date: {
        $gte: new Date(startAfter),
      },
    },
  }
}

function endDateAggregate(endBefore: string): PipelineStage {
  return {
    $match: {
      date: {
        $lte: new Date(endBefore),
      },
    },
  }
}

/**
 * Finds all logs
 * @returns All logs
 */
export async function getLogs() {
  return await MongoDriver.getEntities(LogSchema, requestPipeline)
}

/**
 * Finds logs for the current page with the given page size and sorting
 * @param page The current page to get
 * @param pageSize The number of logs to get per page
 * @param sort The string to sort the logs by
 * @returns The logs for the current page
 */
export async function getPaginatedLogs(
  page: number,
  limit: number,
  sort: string,
  order: string,
  search?: string,
  categorySearch?: string,
  startDate?: string,
  endDate?: string,
  internal?: boolean
) {
  const filteredLogs = await getFilteredLogs(
    sort,
    order,
    search,
    categorySearch,
    startDate,
    endDate,
    internal
  )
  const startIndex = page * limit
  const endIndex = page * limit + limit
  const logs = filteredLogs.slice(startIndex, endIndex)
  return {
    data: logs,
    total: filteredLogs.length,
  }
}

/**
 * Filter and sort logs by params and return the filtered logs
 * @param sort The string to sort the logs by
 * @param order The order to sort the logs by
 * @param search The string to search the logs by
 * @param categorySearch The string to search the logs by category
 * @param startDate The start date to filter the logs by
 * @param endDate The end date to filter the logs by
 * @param internal Only show internal logs
 * @returns Filtered logs
 */
export async function getFilteredLogs(
  sort: string,
  order: string,
  search?: string,
  categorySearch?: string,
  startDate?: string,
  endDate?: string,
  internal?: boolean
) {
  const pipeline = [...requestPipeline]
  if (search) {
    pipeline.push(searchAggregate(search))
  }
  if (categorySearch) {
    pipeline.push(categorySearchAggregate(categorySearch))
  }
  if (startDate) {
    pipeline.push(startDateAggregate(startDate))
  }
  if (endDate) {
    pipeline.push(endDateAggregate(endDate))
  }
  if (internal) {
    pipeline.push({
      $match: {
        'item.itemDefinition.internal': true,
      },
    })
  }
  pipeline.push({
    $sort: {
      [sort]: order === 'asc' ? 1 : -1,
    },
  })

  return await MongoDriver.getEntities(LogSchema, requestPipeline)
}
/**
 * Finds a log by its id
 * @id The id of the log object to find
 * @returns The log with the given _id
 */
export async function getLog(id: string) {
  return (await MongoDriver.getEntity(
    LogSchema,
    id,
    requestPipeline
  )) as LogResponse
}

/**
 * Creates a log
 * @logRequest The log to create
 */
export async function createLog(logRequest: LogPostRequest) {
  apiLogValidation(logRequest as Partial<LogPostRequest>, 'POST')

  await MongoDriver.createEntity(LogSchema, logRequest)
}
