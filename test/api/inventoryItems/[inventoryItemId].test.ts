/* eslint-disable-next-line @typescript-eslint/no-empty-function */
import { ObjectId } from 'mongodb'
import InventoryItemSchema, {
  InventoryItemDocument,
} from 'server/models/InventoryItem'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import inventoryItemHandler from 'pages/api/inventoryItems/[inventoryItemId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import { errors } from 'utils/constants/errors'
import {
  validInventoryItemResponse,
  mockObjectId,
  validInventoryItemPutRequest,
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

describe('api/inventoryItems/[inventoryItemId]', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: urls.api.inventoryItems.inventoryItem(mockObjectId),
      query: {
        inventoryItemId: mockObjectId,
      },
    })
    const response = createResponse()

    await inventoryItemHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'POST',
      url: urls.api.inventoryItems.inventoryItem(mockObjectId),
      query: {
        inventoryItemId: mockObjectId,
      },
    })
    const response = createResponse()

    await inventoryItemHandler(request, response)

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
            validInventoryItemResponse[0] as InventoryItemDocument & {
              _id: ObjectId
            }
        )

      const request = createRequest({
        method: 'GET',
        url: urls.api.inventoryItems.inventoryItem(mockObjectId),
        query: {
          inventoryItemId: mockObjectId,
        },
      })

      const response = createResponse()

      await inventoryItemHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntity).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validInventoryItemResponse[0])
    })
  })

  describe('PUT', () => {
    jest.spyOn(apiValidator, 'apiInventoryItemValidation').mockImplementation()
    test('valid call returns correct data', async () => {
      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(
          async () =>
            validInventoryItemResponse[0] as InventoryItemDocument & {
              _id: ObjectId
            }
        )
      const mockApiInventoryItemValidation = jest
        .spyOn(apiValidator, 'apiInventoryItemValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'PUT',
        url: urls.api.inventoryItems.inventoryItem(mockObjectId),
        query: {
          inventoryItemId: mockObjectId,
        },
        body: validInventoryItemPutRequest,
      })

      const response = createResponse()

      await inventoryItemHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiInventoryItemValidation).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).lastCalledWith(
        InventoryItemSchema,
        mockObjectId,
        validInventoryItemPutRequest
      )
      expect(response.statusCode).toBe(200)
      expect(data).toEqual({})
    })
  })

  describe('DELETE', () => {
    test('valid id returns correct data', async () => {
      const mockDeleteEntity = jest
        .spyOn(MongoDriver, 'softDeleteEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(
          async () =>
            ({ collection: { collectionName: 'inventory_items' } } as Awaited<
              ReturnType<typeof MongoDriver.softDeleteEntity>
            >)
        )
      const request = createRequest({
        method: 'DELETE',
        url: urls.api.inventoryItems.inventoryItem(mockObjectId),
        query: {
          inventoryItemId: mockObjectId,
        },
      })
      const response = createResponse()

      await inventoryItemHandler(request, response)

      expect(mockDeleteEntity).toHaveBeenCalledTimes(1)
      expect(mockDeleteEntity).lastCalledWith(InventoryItemSchema, mockObjectId)
      expect(response.statusCode).toBe(200)
      expect(response._getJSONData().payload).toEqual({})
    })
  })
})
