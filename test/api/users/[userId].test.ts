import { ObjectId } from 'mongodb'
import UserSchema, { UserDocument } from 'server/models/User'
import { ApiError, UserResponse } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import handler from 'pages/api/users/[userId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import mongoose from 'mongoose'
import { clientPromise } from '@api/auth/[...nextauth]'

beforeAll(() => {
  jest.spyOn(apiValidator, 'apiObjectIdValidation').mockImplementation()
  jest
    .spyOn(auth, 'userEndpointServerAuth')
    .mockImplementation(() => Promise.resolve())
  jest
    .spyOn(MongoDriver, 'getEntity')
    .mockImplementation(
      async () => validUserResponse as UserDocument & { _id: ObjectId }
    )
})

// restore mocked implementations and close db connections
afterAll(() => {
  jest.restoreAllMocks()
  mongoose.connection.close()
  clientPromise.then((client) => client.close())
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('api/users/[userId]', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest
      .spyOn(auth, 'userEndpointServerAuth')
      .mockImplementationOnce(async () => {
        throw new ApiError(401, 'Unauthorized')
      })

    const request = createRequest({
      method: 'GET',
      url: `/api/users/${fakeObjectId}`,
      query: {
        userId: fakeObjectId,
      },
    })
    const response = createResponse()

    await handler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe('Unauthorized')
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'POST',
      url: `/api/users/${fakeObjectId}`,
      query: {
        userId: fakeObjectId,
      },
    })
    const response = createResponse()

    await handler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(405)
    expect(data.message).toBe('Method Not Allowed')
    expect(data.success).toBe(false)
  })

  describe('GET', () => {
    test('valid call returns correct data', async () => {
      const mockGetEntity = jest
        .spyOn(MongoDriver, 'getEntity')
        .mockImplementation(
          async () => validUserResponse as UserDocument & { _id: ObjectId }
        )

      const request = createRequest({
        method: 'GET',
        url: `/api/users/${fakeObjectId}`,
        query: {
          userId: fakeObjectId,
        },
      })

      const response = createResponse()

      await handler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntity).toHaveBeenCalledTimes(1)
      expect(mockGetEntity).lastCalledWith(UserSchema, fakeObjectId)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validUserResponse)
    })
  })

  describe('PUT', () => {
    jest.spyOn(apiValidator, 'apiUserValidation').mockImplementation()
    test('valid call returns correct data', async () => {
      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(async () => {})
      const mockApiUserValidation = jest
        .spyOn(apiValidator, 'apiUserValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'PUT',
        url: `/api/users/${fakeObjectId}`,
        query: {
          userId: fakeObjectId,
        },
        body: validUserResponse,
      })

      const response = createResponse()

      await handler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiUserValidation).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).lastCalledWith(
        UserSchema,
        fakeObjectId,
        validUserResponse
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
        url: `/api/users/${fakeObjectId}`,
        query: {
          userId: fakeObjectId,
        },
      })
      const response = createResponse()

      await handler(request, response)

      expect(mockDeleteEntity).toHaveBeenCalledTimes(1)
      expect(mockDeleteEntity).lastCalledWith(UserSchema, fakeObjectId)
      expect(response.statusCode).toBe(200)
      expect(response._getJSONData().payload).toEqual({})
    })
  })
})
const validUserResponse: UserResponse = {
  name: 'Test User',
  email: 'test@user.com',
  image: 'https://test.com/image.jpg',
}
const fakeObjectId = '6408a7156668c5655c25b105'
