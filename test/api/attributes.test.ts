import { ObjectId } from 'mongodb'
import AttributeSchema, { AttributeDocument } from 'server/models/Attribute'
import { ApiError, AttributeResponse } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import handler from 'pages/api/attributes'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import mongoose from 'mongoose'
import { clientPromise } from '@api/auth/[...nextauth]'

beforeAll(() => {
  jest.spyOn(auth, 'serverAuth').mockImplementation(() => Promise.resolve())
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

describe('api/attributes', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, 'Unauthorized')
    })

    const request = createRequest({
      method: 'GET',
      url: '/api/attributes',
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
      method: 'HEAD',
      url: '/api/attributes',
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
      const serverAuth = jest
        .spyOn(auth, 'serverAuth')
        .mockImplementation(() => Promise.resolve())
      const mockGetEntities = jest
        .spyOn(MongoDriver, 'getEntities')
        .mockImplementation(
          async () =>
            validAttributeResponse as [AttributeDocument & { _id: ObjectId }]
        )

      const request = createRequest({
        method: 'GET',
        url: `/api/attributes`,
      })

      const response = createResponse()

      await handler(request, response)
      const data = response._getJSONData().payload

      expect(serverAuth).toHaveBeenCalledTimes(1)
      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(mockGetEntities).lastCalledWith(AttributeSchema)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validAttributeResponse)
    })

    test('valid call with no data returns 204', async () => {
      const mockGetEntities = jest
        .spyOn(MongoDriver, 'getEntities')
        .mockImplementation(async () => [])

      const request = createRequest({
        method: 'GET',
        url: `/api/attributes`,
      })

      const response = createResponse()

      await handler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntities).toHaveBeenCalledTimes(1)
      expect(mockGetEntities).lastCalledWith(AttributeSchema)
      expect(response.statusCode).toBe(204)
      expect(data).toEqual([])
    })
  })

  describe('POST', () => {
    test('valid call returns correct data', async () => {
      const fakeObjectId = '5f9f1c7b9c9b9b0b0c0c0c0c'
      const mockCreateEntity = jest
        .spyOn(MongoDriver, 'createEntity')
        .mockImplementation(
          async () =>
            ({
              ...validAttributeResponse[0],
              _id: fakeObjectId,
            } as AttributeDocument & {
              _id: ObjectId
            })
        )
      const mockApiAttributeValidation = jest
        .spyOn(apiValidator, 'apiAttributeValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'POST',
        url: `/api/attributes`,
        body: validAttributeResponse[0],
      })

      const response = createResponse()

      await handler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiAttributeValidation).toHaveBeenCalledTimes(1)
      expect(mockCreateEntity).toHaveBeenCalledTimes(1)
      expect(mockCreateEntity).lastCalledWith(
        AttributeSchema,
        validAttributeResponse[0]
      )
      expect(response.statusCode).toBe(201)
      expect(data).toEqual(fakeObjectId)
    })
  })
})
const validAttributeResponse: AttributeResponse[] = [
  {
    name: 'test',
    possibleValues: 'text',
    color: '#000000',
  },
]
