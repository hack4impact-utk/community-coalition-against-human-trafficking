import { ObjectId } from 'mongodb'
import LogSchema, { LogDocument } from 'server/models/Log'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import logHandler from 'pages/api/logs/[logId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import { errors } from 'utils/constants/errors'
import {
  validLogResponse,
  mockObjectId,
  validLogPutRequest,
} from 'test/testData'
import urls from 'utils/urls'
import { serverAuthMock } from 'test/helpers/serverAuth'

// TODO: add assertion for GET 'called with' aggregate stuff
// this may need to have different functionality

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

describe('api/logs/[logId]', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: urls.api.logs.log(mockObjectId),
      query: {
        logId: mockObjectId,
      },
    })
    const response = createResponse()

    await logHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'POST',
      url: urls.api.logs.log(mockObjectId),
      query: {
        logId: mockObjectId,
      },
    })
    const response = createResponse()

    await logHandler(request, response)

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
            validLogResponse[0] as LogDocument & {
              _id: ObjectId
            }
        )

      const request = createRequest({
        method: 'GET',
        url: urls.api.logs.log(mockObjectId),
        query: {
          logId: mockObjectId,
        },
      })

      const response = createResponse()

      await logHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntity).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect({ ...data, date: new Date(data.date) }).toEqual(
        validLogResponse[0]
      )
    })
  })

  describe('PUT', () => {
    jest.spyOn(apiValidator, 'apiLogValidation').mockImplementation()
    test('valid call returns correct data', async () => {
      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(
          async () =>
            validLogResponse[0] as LogDocument & {
              _id: ObjectId
            }
        )
      const mockApiLogValidation = jest
        .spyOn(apiValidator, 'apiLogValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'PUT',
        url: urls.api.logs.log(mockObjectId),
        query: {
          logId: mockObjectId,
        },
        body: validLogPutRequest,
      })

      const response = createResponse()

      await logHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiLogValidation).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).lastCalledWith(
        LogSchema,
        mockObjectId,
        validLogPutRequest
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
        url: urls.api.logs.log(mockObjectId),
        query: {
          logId: mockObjectId,
        },
      })
      const response = createResponse()

      await logHandler(request, response)

      expect(mockDeleteEntity).toHaveBeenCalledTimes(1)
      expect(mockDeleteEntity).lastCalledWith(LogSchema, mockObjectId)
      expect(response.statusCode).toBe(200)
      expect(response._getJSONData().payload).toEqual({})
    })
  })
})
