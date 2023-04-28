import LogSchema from 'server/models/Log'
import * as MongoDriver from 'server/actions/MongoDriver'
import { PipelineStage } from 'mongoose'
import { apiLogValidation } from 'utils/apiValidators'
import { LogPostRequest } from 'utils/types'

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
]

/**
 * Finds all logs
 * @returns All logs
 */
export async function getLogs() {
  return await MongoDriver.getEntities(LogSchema, requestPipeline)
}

/**
 * Finds a log by its id
 * @id The id of the log object to find
 * @returns The log with the given _id
 */
export async function getLog(id: string) {
  return await MongoDriver.getEntity(LogSchema, id, requestPipeline)
}

export async function createLog(logRequest: LogPostRequest) {
  apiLogValidation(logRequest as Partial<LogPostRequest>, 'POST')

  await MongoDriver.createEntity(LogSchema, logRequest)
}
