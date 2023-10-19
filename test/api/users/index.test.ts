import { ObjectId } from 'mongodb'
import UserSchema, { UserDocument } from 'server/models/User'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import usersHandler from 'pages/api/users'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import mongoose from 'mongoose'
import { errors } from 'utils/constants/errors'
import {
  validUserResponse,
  mockObjectId,
  validUserPostRequest,
} from 'test/testData'
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
  mongoose.connection.close()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('api/users', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: urls.api.users.users,
    })
    const response = createResponse()

    await usersHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'HEAD',
      url: urls.api.users.users,
    })
    const response = createResponse()

    await usersHandler(request, response)

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
          async () => validUserResponse as [UserDocument & { _id: ObjectId }]
        )

      const request = createRequest({
        method: 'GET',
        url: urls.api.users.users,
      })

      const response = createResponse()

      await usersHandler(request, response)
      const data = response._getJSONData().payload

      expect(serverAuth).toHaveBeenCalledTimes(1)
      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(mockGetEntities).lastCalledWith(UserSchema)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validUserResponse)
    })

    test('valid call with no data returns empty array', async () => {
      const mockGetEntities = jest
        .spyOn(MongoDriver, 'getEntities')
        .mockImplementation(async () => [])

      const request = createRequest({
        method: 'GET',
        url: urls.api.users.users,
      })

      const response = createResponse()

      await usersHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(mockGetEntities).lastCalledWith(UserSchema)
      expect(data).toEqual([])
    })
  })

  describe('POST', () => {
    test('valid call returns correct data', async () => {
      const mockCreateEntity = jest
        .spyOn(MongoDriver, 'createEntity')
        .mockImplementation(
          async () => validUserResponse[0] as UserDocument & { _id: ObjectId }
        )
      const mockApiUserValidation = jest
        .spyOn(apiValidator, 'apiUserValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'POST',
        url: urls.api.users.users,
        body: validUserPostRequest,
      })

      const response = createResponse()

      await usersHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiUserValidation).toHaveBeenCalledTimes(1)
      expect(mockCreateEntity).toHaveBeenCalledTimes(1)
      expect(mockCreateEntity).lastCalledWith(UserSchema, validUserPostRequest)
      expect(response.statusCode).toBe(201)
      expect(data).toEqual(mockObjectId)
    })
  })
})
