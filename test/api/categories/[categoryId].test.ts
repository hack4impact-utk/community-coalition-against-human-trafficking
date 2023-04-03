import { ObjectId } from 'mongodb'
import CategorySchema, { CategoryDocument } from 'server/models/Category'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import categoryHandler from 'pages/api/categories/[categoryId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import mongoose from 'mongoose'
import { clientPromise } from '@api/auth/[...nextauth]'
import constants from 'utils/constants'
import {
  validCategoryResponse,
  mockObjectId,
  validCategoryPutRequest,
} from 'test/testData'

beforeAll(() => {
  jest.spyOn(auth, 'serverAuth').mockImplementation(() => Promise.resolve())

  jest.spyOn(apiValidator, 'apiObjectIdValidation').mockImplementation()
})

// restore mocked implementations and close db connections
afterAll(() => {
  jest.restoreAllMocks()
  mongoose.connection.close()
  clientPromise.then((client) => client.close())
})

describe('api/categories/[categoryId]', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, constants.errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: `/api/categories/${mockObjectId}`,
      query: {
        categoryId: mockObjectId,
      },
    })
    const response = createResponse()

    await categoryHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(constants.errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'POST',
      url: `/api/categories/${mockObjectId}`,
      query: {
        categoryId: mockObjectId,
      },
    })
    const response = createResponse()

    await categoryHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(405)
    expect(data.message).toBe(constants.errors.invalidReqMethod)
    expect(data.success).toBe(false)
  })

  describe('GET', () => {
    test('valid call returns correct data', async () => {
      const mockGetEntity = jest
        .spyOn(MongoDriver, 'getEntity')
        .mockImplementation(
          async () =>
            validCategoryResponse[0] as CategoryDocument & { _id: ObjectId }
        )

      const request = createRequest({
        method: 'GET',
        url: `/api/categories/${mockObjectId}`,
        query: {
          categoryId: mockObjectId,
        },
      })

      const response = createResponse()

      await categoryHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntity).toHaveBeenCalledTimes(1)
      expect(mockGetEntity).lastCalledWith(CategorySchema, mockObjectId)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validCategoryResponse[0])
    })
  })

  describe('PUT', () => {
    jest.spyOn(apiValidator, 'apiCategoryValidation').mockImplementation()
    test('valid call returns correct data', async () => {
      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(async () => {})
      const mockApiCategoryValidation = jest
        .spyOn(apiValidator, 'apiCategoryValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'PUT',
        url: `/api/categories/${mockObjectId}`,
        query: {
          categoryId: mockObjectId,
        },
        body: validCategoryPutRequest,
      })

      const response = createResponse()

      await categoryHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiCategoryValidation).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).lastCalledWith(
        CategorySchema,
        mockObjectId,
        validCategoryPutRequest
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
        url: `/api/categories/${mockObjectId}`,
        query: {
          categoryId: mockObjectId,
        },
      })
      const response = createResponse()

      await categoryHandler(request, response)

      expect(mockDeleteEntity).toHaveBeenCalledTimes(1)
      expect(mockDeleteEntity).lastCalledWith(CategorySchema, mockObjectId)
      expect(response.statusCode).toBe(200)
      expect(response._getJSONData().payload).toEqual({})
    })
  })
})
