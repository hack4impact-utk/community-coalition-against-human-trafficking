import { ObjectId } from 'mongodb'
import LogSchema, { LogDocument } from 'server/models/Log'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import logsHandler from 'pages/api/logs'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import { errors } from 'utils/constants/errors'
import {
  validLogResponse,
  mockObjectId,
  validLogPostRequest,
} from 'test/testData'

beforeAll(() => {
  jest.spyOn(auth, 'serverAuth').mockImplementation(() => Promise.resolve())
})

// restore mocked implementations and close db connections
afterAll(() => {
  jest.restoreAllMocks()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('api/logs', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: '/api/logs',
    })
    const response = createResponse()

    await logsHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'HEAD',
      url: '/api/logs',
    })
    const response = createResponse()

    await logsHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(405)
    expect(data.message).toBe(errors.invalidReqMethod)
    expect(data.success).toBe(false)
  })
  describe('GET', () => {
    test('valid call returns correct data', async () => {
      const serverAuth = jest
        .spyOn(auth, 'serverAuth')
        .mockImplementation(() => Promise.resolve())
      const mockGetEntities = jest
        .spyOn(MongoDriver, 'getEntities')
        .mockImplementation(
          async () => validLogResponse as [LogDocument & { _id: ObjectId }]
        )

      const request = createRequest({
        method: 'GET',
        url: `/api/logs`,
      })

      const response = createResponse()

      await logsHandler(request, response)
      const data = response._getJSONData().payload

      expect(serverAuth).toHaveBeenCalledTimes(1)
      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validLogResponse)
    })

    test('valid call with no data returns 204', async () => {
      const mockGetEntities = jest
        .spyOn(MongoDriver, 'getEntities')
        .mockImplementation(async () => [])

      const request = createRequest({
        method: 'GET',
        url: `/api/logs`,
      })

      const response = createResponse()

      await logsHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(204)
      expect(data).toEqual([])
    })
  })

  // there is an issue with this -- will be resolved in CCAHT-145
  // describe('POST', () => {
  //   test('valid call returns correct data', async () => {
  //     const mockCreateEntity = jest
  //       .spyOn(MongoDriver, 'createEntity')
  //       .mockImplementation(
  //         async () =>
  //           validLogResponse[0] as LogDocument & {
  //             _id: ObjectId
  //           }
  //       )
  //     const mockApiLogValidation = jest
  //       .spyOn(apiValidator, 'apiLogValidation')
  //       .mockImplementation()

  //     const request = createRequest({
  //       method: 'POST',
  //       url: `/api/logs`,
  //       body: validLogPostRequest,
  //     })

  //     const response = createResponse()

  //     await logsHandler(request, response)
  //     const data = response._getJSONData().payload

  //     expect(mockApiLogValidation).toHaveBeenCalledTimes(1)
  //     expect(mockCreateEntity).toHaveBeenCalledTimes(1)
  //     expect(mockCreateEntity).lastCalledWith(LogSchema, validLogPostRequest)
  //     expect(response.statusCode).toBe(201)
  //     expect(data).toEqual(mockObjectId)
  //   })
  // })
})
