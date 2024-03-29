import { ObjectId } from 'mongodb'
import InventoryItemSchema, {
  InventoryItemDocument,
} from 'server/models/InventoryItem'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import inventoryItemsHandler from 'pages/api/inventoryItems'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import { errors } from 'utils/constants/errors'
import {
  validInventoryItemResponse,
  mockObjectId,
  validInventoryItemPostRequest,
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
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('api/inventoryItems', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: urls.api.inventoryItems.inventoryItems,
    })
    const response = createResponse()

    await inventoryItemsHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'HEAD',
      url: urls.api.inventoryItems.inventoryItems,
    })
    const response = createResponse()

    await inventoryItemsHandler(request, response)

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
          async () =>
            validInventoryItemResponse as [
              InventoryItemDocument & { _id: ObjectId }
            ]
        )

      const request = createRequest({
        method: 'GET',
        url: urls.api.inventoryItems.inventoryItems,
      })

      const response = createResponse()

      await inventoryItemsHandler(request, response)
      const payload = response._getJSONData().payload

      expect(serverAuth).toHaveBeenCalledTimes(1)
      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(payload.total).toEqual(validInventoryItemResponse.length)
      expect(payload.data).toEqual(validInventoryItemResponse)
    })

    test('valid call with no data returns empty array', async () => {
      const mockGetEntities = jest
        .spyOn(MongoDriver, 'getEntities')
        .mockImplementation(async () => [])

      const request = createRequest({
        method: 'GET',
        url: urls.api.inventoryItems.inventoryItems,
      })

      const response = createResponse()

      await inventoryItemsHandler(request, response)
      const payload = response._getJSONData().payload

      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(payload.data).toEqual([])
      expect(payload.total).toEqual(0)
    })
  })

  describe('POST', () => {
    test('valid call returns correct data', async () => {
      const mockCreateEntity = jest
        .spyOn(MongoDriver, 'createEntity')
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
        method: 'POST',
        url: urls.api.inventoryItems.inventoryItems,
        body: validInventoryItemPostRequest,
      })

      const response = createResponse()

      await inventoryItemsHandler(request, response)
      const data = response._getJSONData().payload
      expect(mockApiInventoryItemValidation).toHaveBeenCalledTimes(1)
      expect(mockCreateEntity).toHaveBeenCalledTimes(1)
      expect(mockCreateEntity).lastCalledWith(
        InventoryItemSchema,
        validInventoryItemPostRequest
      )
      expect(response.statusCode).toBe(201)
      expect(data).toEqual(mockObjectId)
    })
  })
})
