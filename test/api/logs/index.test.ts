import { ObjectId } from 'mongodb'
import { LogDocument } from 'server/models/Log'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import logsHandler from 'pages/api/logs'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import { errors } from 'utils/constants/errors'
import { validLogResponse } from 'test/testData'
import urls from 'utils/urls'
import { serverAuthMock } from 'test/helpers/serverAuth'

beforeAll(() => {
  jest
    .spyOn(auth, 'serverAuth')
    .mockImplementation(() => Promise.resolve(serverAuthMock))
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
      url: urls.api.logs.logs,
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
      url: urls.api.logs.logs,
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
        .mockImplementation(() => Promise.resolve(serverAuthMock))
      const mockGetEntities = jest
        .spyOn(MongoDriver, 'getEntities')
        .mockImplementation(
          async () => validLogResponse as [LogDocument & { _id: ObjectId }]
        )

      const request = createRequest({
        method: 'GET',
        url: urls.api.logs.logs,
      })

      const response = createResponse()

      await logsHandler(request, response)
      const data = response._getJSONData().payload

      expect(serverAuth).toHaveBeenCalledTimes(1)
      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(data.total).toBe(1)
      expect([{ ...data.data[0], date: new Date(data.data[0].date) }]).toEqual(
        validLogResponse
      )
    })

    test('valid call with no data returns empty payload', async () => {
      const mockGetEntities = jest
        .spyOn(MongoDriver, 'getEntities')
        .mockImplementation(async () => [])

      const request = createRequest({
        method: 'GET',
        url: urls.api.logs.logs,
      })

      const response = createResponse()

      await logsHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(data.data).toEqual([])
      expect(data.total).toBe(0)
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
