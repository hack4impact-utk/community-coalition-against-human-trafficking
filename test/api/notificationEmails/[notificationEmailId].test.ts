import { ObjectId } from 'mongodb'
import NotificationEmailSchema, {
  NotificationEmailDocument,
} from 'server/models/NotificationEmail'
import { ApiError, NotificationEmailResponse } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import notificationEmailHandler from 'pages/api/notificationEmails/[notificationEmailId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import { clientPromise } from '@api/auth/[...nextauth]'
import { errors } from 'utils/constants/errors'
import {
  validNotificationEmailResponse,
  mockObjectId,
  validNotificationEmailPutRequest,
} from 'test/testData'

// TODO: add assertion for GET 'called with' aggregate stuff
// this may need to have different functionality

beforeAll(() => {
  jest.spyOn(auth, 'serverAuth').mockImplementation(() => Promise.resolve())
  jest.spyOn(apiValidator, 'apiObjectIdValidation').mockImplementation()
})

// restore mocked implementations and close db connections
afterAll(() => {
  jest.restoreAllMocks()
  
})

describe('api/notificationEmails/[notificationEmailId]', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: `/api/notificationEmails/${mockObjectId}`,
      query: {
        notificationEmailId: mockObjectId,
      },
    })
    const response = createResponse()

    await notificationEmailHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'POST',
      url: `/api/notificationEmails/${mockObjectId}`,
      query: {
        notificationEmailId: mockObjectId,
      },
    })
    const response = createResponse()

    await notificationEmailHandler(request, response)

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
            validNotificationEmailResponse[0] as NotificationEmailDocument & {
              _id: ObjectId
            }
        )

      const request = createRequest({
        method: 'GET',
        url: `/api/notificationEmails/${mockObjectId}`,
        query: {
          notificationEmailId: mockObjectId,
        },
      })

      const response = createResponse()

      await notificationEmailHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntity).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validNotificationEmailResponse[0])
    })
  })

  describe('PUT', () => {
    jest.spyOn(apiValidator, 'apiNotificationEmailValidation').mockImplementation()
    test('valid call returns correct data', async () => {
      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(async () => {})
      const mockApiNotificationEmailValidation = jest
        .spyOn(apiValidator, 'apiNotificationEmailValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'PUT',
        url: `/api/notificationEmails/${mockObjectId}`,
        query: {
          notificationEmailId: mockObjectId,
        },
        body: validNotificationEmailPutRequest,
      })

      const response = createResponse()

      await notificationEmailHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiNotificationEmailValidation).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).lastCalledWith(
        NotificationEmailSchema,
        mockObjectId,
        validNotificationEmailPutRequest
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
        url: `/api/notificationEmails/${mockObjectId}`,
        query: {
          notificationEmailId: mockObjectId,
        },
      })
      const response = createResponse()

      await notificationEmailHandler(request, response)

      expect(mockDeleteEntity).toHaveBeenCalledTimes(1)
      expect(mockDeleteEntity).lastCalledWith(
        NotificationEmailSchema,
        mockObjectId
      )
      expect(response.statusCode).toBe(200)
      expect(response._getJSONData().payload).toEqual({})
    })
  })
})
