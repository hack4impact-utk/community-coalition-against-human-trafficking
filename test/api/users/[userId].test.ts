import { ObjectId } from 'mongodb'
import UserSchema, { UserDocument } from 'server/models/User'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import userHandler from 'pages/api/users/[userId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import mongoose from 'mongoose'
import { errors } from 'utils/constants/errors'
import {
  validUserResponse,
  mockObjectId,
  validUserPutRequest,
} from 'test/testData'
import urls from 'utils/urls'

beforeAll(() => {
  jest.spyOn(apiValidator, 'apiObjectIdValidation').mockImplementation()
  jest
    .spyOn(auth, 'userEndpointServerAuth')
    .mockImplementation(() => Promise.resolve())
  jest
    .spyOn(MongoDriver, 'getEntity')
    .mockImplementation(
      async () => validUserResponse[0] as UserDocument & { _id: ObjectId }
    )
})

// restore mocked implementations and close db connections
afterAll(() => {
  jest.restoreAllMocks()
  mongoose.connection.close()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('api/users/[userId]', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest
      .spyOn(auth, 'userEndpointServerAuth')
      .mockImplementationOnce(async () => {
        throw new ApiError(401, errors.unauthorized)
      })

    const request = createRequest({
      method: 'GET',
      url: urls.api.users.user(mockObjectId),
      query: {
        userId: mockObjectId,
      },
    })
    const response = createResponse()

    await userHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'POST',
      url: urls.api.users.user(mockObjectId),
      query: {
        userId: mockObjectId,
      },
    })
    const response = createResponse()

    await userHandler(request, response)

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
          async () => validUserResponse[0] as UserDocument & { _id: ObjectId }
        )

      const request = createRequest({
        method: 'GET',
        url: urls.api.users.user(mockObjectId),
        query: {
          userId: mockObjectId,
        },
      })

      const response = createResponse()

      await userHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntity).toHaveBeenCalledTimes(1)
      expect(mockGetEntity).lastCalledWith(UserSchema, mockObjectId)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validUserResponse[0])
    })
  })

  describe('PUT', () => {
    jest.spyOn(apiValidator, 'apiUserValidation').mockImplementation()
    test('valid call returns correct data', async () => {
      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(
          async () =>
            validUserResponse[0] as UserDocument & {
              _id: ObjectId
            }
        )
      const mockApiUserValidation = jest
        .spyOn(apiValidator, 'apiUserValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'PUT',
        url: urls.api.users.user(mockObjectId),
        query: {
          userId: mockObjectId,
        },
        body: validUserPutRequest,
      })

      const response = createResponse()

      await userHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiUserValidation).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).lastCalledWith(
        UserSchema,
        mockObjectId,
        validUserPutRequest
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
        url: urls.api.users.user(mockObjectId),
        query: {
          userId: mockObjectId,
        },
      })
      const response = createResponse()

      await userHandler(request, response)

      expect(mockDeleteEntity).toHaveBeenCalledTimes(1)
      expect(mockDeleteEntity).lastCalledWith(UserSchema, mockObjectId)
      expect(response.statusCode).toBe(200)
      expect(response._getJSONData().payload).toEqual({})
    })
  })
})
