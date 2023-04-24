import { ObjectId } from 'mongodb'
import ItemDefinitionSchema, {
  ItemDefinitionDocument,
} from 'server/models/ItemDefinition'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import itemDefinitionsHandler from 'pages/api/itemDefinitions'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import { clientPromise } from '@api/auth/[...nextauth]'
import { errors } from 'utils/constants/errors'
import {
  validItemDefinitionResponse,
  mockObjectId,
  validItemDefinitionPostRequest,
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

describe('api/itemDefinitions', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: '/api/itemDefinitions',
    })
    const response = createResponse()

    await itemDefinitionsHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'HEAD',
      url: '/api/itemDefinitions',
    })
    const response = createResponse()

    await itemDefinitionsHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(405)
    expect(data.message).toBe(errors.invalidReqMethod)
    expect(data.success).toBe(false)
  })
  describe('GET', () => {
    test('valid call returns correct data', async () => {
      const serverAuth = jest
        .spyOn(auth, 'serverAuth')
        .mockImplementation(() => Promise.resolve())
      const mockGetEntities = jest
        .spyOn(MongoDriver, 'getEntities')
        .mockImplementation(
          async () =>
            validItemDefinitionResponse as [
              ItemDefinitionDocument & { _id: ObjectId }
            ]
        )

      const request = createRequest({
        method: 'GET',
        url: `/api/itemDefinitions`,
      })

      const response = createResponse()

      await itemDefinitionsHandler(request, response)
      const data = response._getJSONData().payload

      expect(serverAuth).toHaveBeenCalledTimes(1)
      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validItemDefinitionResponse)
    })

    test('valid call with no data returns 204', async () => {
      const mockGetEntities = jest
        .spyOn(MongoDriver, 'getEntities')
        .mockImplementation(async () => [])

      const request = createRequest({
        method: 'GET',
        url: `/api/itemDefinitions`,
      })

      const response = createResponse()

      await itemDefinitionsHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(204)
      expect(data).toEqual([])
    })
  })

  describe('POST', () => {
    test('valid call returns correct data', async () => {
      const mockCreateEntity = jest
        .spyOn(MongoDriver, 'createEntity')
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
        method: 'POST',
        url: `/api/itemDefinitions`,
        body: validItemDefinitionPostRequest,
      })

      const response = createResponse()

      await itemDefinitionsHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiItemDefinitionValidation).toHaveBeenCalledTimes(1)
      expect(mockCreateEntity).toHaveBeenCalledTimes(1)
      expect(mockCreateEntity).lastCalledWith(
        ItemDefinitionSchema,
        validItemDefinitionPostRequest
      )
      expect(response.statusCode).toBe(201)
      expect(data).toEqual(mockObjectId)
    })
  })
})
