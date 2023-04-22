import { ObjectId } from 'mongodb'
import InventoryItemSchema, {
  InventoryItemDocument,
} from 'server/models/InventoryItem'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import inventoryItemsCheckInHandler from 'pages/api/inventoryItems/checkIn'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as InventoryItemActions from 'server/actions/InventoryItems'
import * as apiValidator from 'utils/apiValidators'
import { clientPromise } from '@api/auth/[...nextauth]'
import { errors } from 'utils/constants/errors'
import {
  validInventoryItemResponse,
  mockObjectId,
  validInventoryItemPostRequest,
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

describe('api/inventoryItems/checkIn', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: '/api/inventoryItems/checkIn/checkIn',
    })
    const response = createResponse()

    await inventoryItemsCheckInHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'HEAD',
      url: '/api/inventoryItems/checkIn',
    })
    const response = createResponse()

    await inventoryItemsCheckInHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(405)
    expect(data.message).toBe(errors.invalidReqMethod)
    expect(data.success).toBe(false)
  })

  describe('POST', () => {
    test('valid call', async () => {
      const mockCheckIn = jest
        .spyOn(InventoryItemActions, 'checkInInventoryItem')
        .mockImplementation()

      const request = createRequest({
        method: 'POST',
        url: `/api/inventoryItems/checkIn?quantity=3`,
        body: validInventoryItemPostRequest,
      })

      const response = createResponse()

      await inventoryItemsCheckInHandler(request, response)
      expect(mockCheckIn).lastCalledWith(validInventoryItemPostRequest, 3)
      expect(response.statusCode).toBe(200)
    })
  })
})
