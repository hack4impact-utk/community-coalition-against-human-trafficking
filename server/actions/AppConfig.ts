import { PipelineStage } from 'mongoose'
import { AppConfigResponse } from 'utils/types'
import AppConfigSchema from 'server/models/AppConfig'
import { getEntities, getEntity } from './MongoDriver'

const requestPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: 'attributes',
      localField: 'defaultAttributes',
      foreignField: '_id',
      as: 'defaultAttributes',
    },
  },
]

/**
 * Finds an appConfig by its id
 * @id The id of the AppConfig object to find
 * @returns The AppConfig given by the appConfig parameter
 */
export async function getAppConfig(id: string) {
  return (await getEntity(
    AppConfigSchema,
    id,
    requestPipeline
  )) as AppConfigResponse
}

/**
 * Finds all appConfigs
 * @returns All appConfigs
 */
export async function getAppConfigs() {
  return (await getEntities(
    AppConfigSchema,
    requestPipeline
  )) as AppConfigResponse[]
}
