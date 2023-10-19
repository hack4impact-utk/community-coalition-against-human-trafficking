import { ObjectId } from 'mongodb'
import AppConfigSchema, { AppConfigDocument } from 'server/models/AppConfig'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import appConfigHandler from '@api/appConfigs/[appConfigId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import { errors } from 'utils/constants/errors'
import {
  validAppConfigResponse,
  mockObjectId,
  validAppConfigPutRequest,
} from 'test/testData'
import urls from 'utils/urls'
import { serverAuthMock } from 'test/helpers/serverAuth'

beforeAll(() => {
  jest
    .spyOn(auth, 'serverAuth')
    .mockImplementation(() => Promise.resolve(serverAuthMock))
  jest.spyOn(apiValidator, 'apiObjectIdValidation').mockImplementation()
})

// restore mocked implementations and close db connections
afterAll(() => {
  jest.restoreAllMocks()
})

describe('api/appConfigs/[appConfigId]', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: urls.api.appConfigs.appConfig(mockObjectId),
      query: {
        appConfigId: mockObjectId,
      },
    })
    const response = createResponse()

    await appConfigHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'POST',
      url: urls.api.appConfigs.appConfig(mockObjectId),
      query: {
        appConfigId: mockObjectId,
      },
    })
    const response = createResponse()

    await appConfigHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(405)
    expect(data.message).toBe(errors.invalidReqMethod)
    expect(data.success).toBe(false)
  })
  describe('GET', () => {
    test('valid call returns correct data', async () => {
      const mockGetEntity = jest
        .spyOn(MongoDriver, 'getEntity')
        .mockImplementation(
          async () =>
            validAppConfigResponse[0] as AppConfigDocument & {
              _id: ObjectId
            }
        )

      const request = createRequest({
        method: 'GET',
        url: urls.api.appConfigs.appConfig(mockObjectId),
        query: {
          appConfigId: mockObjectId,
        },
      })

      const response = createResponse()

      await appConfigHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntity).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validAppConfigResponse[0])
    })
  })

  describe('PUT', () => {
    jest.spyOn(apiValidator, 'apiAppConfigValidation').mockImplementation()
    test('valid call returns correct data', async () => {
      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        .mockImplementation(
          async () =>
            validAppConfigResponse[0] as AppConfigDocument & {
              _id: ObjectId
            }
        )
      const mockApiAppConfigValidation = jest
        .spyOn(apiValidator, 'apiAppConfigValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'PUT',
        url: urls.api.appConfigs.appConfig(mockObjectId),
        query: {
          appConfigId: mockObjectId,
        },
        body: validAppConfigPutRequest,
      })

      const response = createResponse()

      await appConfigHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiAppConfigValidation).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).lastCalledWith(
        AppConfigSchema,
        mockObjectId,
        validAppConfigPutRequest
      )
      expect(response.statusCode).toBe(200)
      expect(data).toEqual({})
    })
  })

  describe('DELETE', () => {
    test('valid id returns correct data', async () => {
      const mockDeleteEntity = jest
        .spyOn(MongoDriver, 'deleteEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(async () => {})
      const request = createRequest({
        method: 'DELETE',
        url: urls.api.appConfigs.appConfig(mockObjectId),
        query: {
          appConfigId: mockObjectId,
        },
      })
      const response = createResponse()

      await appConfigHandler(request, response)

      expect(mockDeleteEntity).toHaveBeenCalledTimes(1)
      expect(mockDeleteEntity).lastCalledWith(AppConfigSchema, mockObjectId)
      expect(response.statusCode).toBe(200)
      expect(response._getJSONData().payload).toEqual({})
    })
  })
})
