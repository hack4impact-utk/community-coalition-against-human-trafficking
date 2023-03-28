/* eslint-disable-next-line @typescript-eslint/no-empty-function */
import { ObjectId } from 'mongodb'
import ItemDefinitionSchema, {
  ItemDefinitionDocument,
} from 'server/models/ItemDefinition'
import { ApiError, ItemDefinitionResponse } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import handler from 'pages/api/itemDefinitions/[itemDefinitionId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import { clientPromise } from '@api/auth/[...nextauth]'
import constants from 'utils/constants'

// TODO: add assertion for GET 'called with' aggregate stuff
// this may need to have different functionality

beforeAll(() => {
  jest.spyOn(auth, 'serverAuth').mockImplementation(() => Promise.resolve())
  jest.spyOn(apiValidator, 'apiObjectIdValidation').mockImplementation()
})

// restore mocked implementations and close db connections
afterAll(() => {
  jest.restoreAllMocks()
  clientPromise.then((client) => client.close())
})

describe('api/itemDefinitions/[itemDefinitionId]', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, constants.errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: `/api/itemDefinitions/${fakeObjectId}`,
      query: {
        itemDefinitionId: fakeObjectId,
      },
    })
    const response = createResponse()

    await handler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(constants.errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'POST',
      url: `/api/itemDefinitions/${fakeObjectId}`,
      query: {
        itemDefinitionId: fakeObjectId,
      },
    })
    const response = createResponse()

    await handler(request, response)

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
            validItemDefinitionResponse as ItemDefinitionDocument & {
              _id: ObjectId
            }
        )

      const request = createRequest({
        method: 'GET',
        url: `/api/itemDefinitions/${fakeObjectId}`,
        query: {
          itemDefinitionId: fakeObjectId,
        },
      })

      const response = createResponse()

      await handler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntity).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validItemDefinitionResponse)
    })
  })

  describe('PUT', () => {
    jest.spyOn(apiValidator, 'apiItemDefinitionValidation').mockImplementation()
    test('valid call returns correct data', async () => {
      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(async () => {})
      const mockApiItemDefinitionValidation = jest
        .spyOn(apiValidator, 'apiItemDefinitionValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'PUT',
        url: `/api/itemDefinitions/${fakeObjectId}`,
        query: {
          itemDefinitionId: fakeObjectId,
        },
        body: validItemDefinitionResponse,
      })

      const response = createResponse()

      await handler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiItemDefinitionValidation).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).lastCalledWith(
        ItemDefinitionSchema,
        fakeObjectId,
        validItemDefinitionResponse
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
        url: `/api/itemDefinitions/${fakeObjectId}`,
        query: {
          itemDefinitionId: fakeObjectId,
        },
      })
      const response = createResponse()

      await handler(request, response)

      expect(mockDeleteEntity).toHaveBeenCalledTimes(1)
      expect(mockDeleteEntity).lastCalledWith(
        ItemDefinitionSchema,
        fakeObjectId
      )
      expect(response.statusCode).toBe(200)
      expect(response._getJSONData().payload).toEqual({})
    })
  })
})
const validItemDefinitionResponse: ItemDefinitionResponse = {
  _id: '1',
  name: 'Test Item',
  internal: false,
  lowStockThreshold: 10,
  criticalStockThreshold: 5,
  category: {
    _id: '2',
    name: 'Test Category',
  },
  attributes: [
    {
      _id: '3',
      name: 'Test Attribute',
      possibleValues: 'text',
      color: '#000000',
    },
  ],
}

const fakeObjectId = '6408a7156668c5655c25b105'
