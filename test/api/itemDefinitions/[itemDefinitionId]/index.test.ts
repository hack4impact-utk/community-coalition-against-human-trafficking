import { ObjectId } from 'mongodb'
import ItemDefinitionSchema, {
  ItemDefinitionDocument,
} from 'server/models/ItemDefinition'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import itemDefinitionHandler from '@api/itemDefinitions/[itemDefinitionId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import { errors } from 'utils/constants/errors'
import {
  validItemDefinitionResponse,
  mockObjectId,
  validItemDefinitionPutRequest,
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

describe('api/itemDefinitions/[itemDefinitionId]', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: urls.api.itemDefinitions.itemDefinition(mockObjectId),
      query: {
        itemDefinitionId: mockObjectId,
      },
    })
    const response = createResponse()

    await itemDefinitionHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'POST',
      url: urls.api.itemDefinitions.itemDefinition(mockObjectId),
      query: {
        itemDefinitionId: mockObjectId,
      },
    })
    const response = createResponse()

    await itemDefinitionHandler(request, response)

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
            validItemDefinitionResponse[0] as ItemDefinitionDocument & {
              _id: ObjectId
            }
        )

      const request = createRequest({
        method: 'GET',
        url: urls.api.itemDefinitions.itemDefinition(mockObjectId),
        query: {
          itemDefinitionId: mockObjectId,
        },
      })

      const response = createResponse()

      await itemDefinitionHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntity).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validItemDefinitionResponse[0])
    })
  })

  describe('PUT', () => {
    jest.spyOn(apiValidator, 'apiItemDefinitionValidation').mockImplementation()
    test('valid call returns correct data', async () => {
      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(
          async () =>
            validItemDefinitionResponse[0] as ItemDefinitionDocument & {
              _id: ObjectId
            }
        )
      const mockApiItemDefinitionValidation = jest
        .spyOn(apiValidator, 'apiItemDefinitionValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'PUT',
        url: urls.api.itemDefinitions.itemDefinition(mockObjectId),
        query: {
          itemDefinitionId: mockObjectId,
        },
        body: validItemDefinitionPutRequest,
      })

      const response = createResponse()

      await itemDefinitionHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiItemDefinitionValidation).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).lastCalledWith(
        ItemDefinitionSchema,
        mockObjectId,
        validItemDefinitionPutRequest
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
          async () => ({} as ReturnType<typeof MongoDriver.softDeleteEntity>)
        )
      const request = createRequest({
        method: 'DELETE',
        url: urls.api.itemDefinitions.itemDefinition(mockObjectId),
        query: {
          itemDefinitionId: mockObjectId,
        },
      })
      const response = createResponse()

      await itemDefinitionHandler(request, response)

      expect(mockDeleteEntity).toHaveBeenCalledTimes(1)
      expect(mockDeleteEntity).lastCalledWith(
        ItemDefinitionSchema,
        mockObjectId
      )
      expect(response.statusCode).toBe(200)
      expect(response._getJSONData().payload).toEqual({})
    })
  })
})
