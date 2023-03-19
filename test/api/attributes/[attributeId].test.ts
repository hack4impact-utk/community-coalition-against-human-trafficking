import { ObjectId } from 'mongodb'
import AttributeSchema, { AttributeDocument } from 'server/models/Attribute'
import { ApiError, AttributeResponse } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import handler from 'pages/api/attributes/[attributeId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import mongoose from 'mongoose'
import { clientPromise } from '@api/auth/[...nextauth]'

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

describe('api/attributes/[attributeId]', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    const mockObjectId = '6408a7156668c5655c25b105'

    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, 'Unauthorized')
    })

    const request = createRequest({
      method: 'GET',
      url: `/api/attributes/${mockObjectId}`,
      query: {
        attributeId: mockObjectId,
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
    const mockObjectId = '6408a7156668c5655c25b105'

    const request = createRequest({
      method: 'POST',
      url: `/api/attributes/${mockObjectId}`,
      query: {
        attributeId: mockObjectId,
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
      const mockObjectId = '6408a7156668c5655c25b105'

      const mockGetEntity = jest
        .spyOn(MongoDriver, 'getEntity')
        .mockImplementation(
          async () =>
            validAttributeResponse as AttributeDocument & { _id: ObjectId }
        )

      const request = createRequest({
        method: 'GET',
        url: `/api/attributes/${mockObjectId}`,
        query: {
          attributeId: mockObjectId,
        },
      })

      const response = createResponse()

      await handler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntity).toHaveBeenCalledTimes(1)
      expect(mockGetEntity).lastCalledWith(AttributeSchema, mockObjectId)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validAttributeResponse)
    })
  })

  describe('PUT', () => {
    jest.spyOn(apiValidator, 'apiAttributeValidation').mockImplementation()
    test('valid call returns correct data', async () => {
      const mockObjectId = '6408a7156668c5655c25b105'

      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(async () => {})
      const mockApiAttributeValidation = jest
        .spyOn(apiValidator, 'apiAttributeValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'PUT',
        url: `/api/attributes/${mockObjectId}`,
        query: {
          attributeId: mockObjectId,
        },
        body: validAttributeResponse,
      })

      const response = createResponse()

      await handler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiAttributeValidation).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).lastCalledWith(
        AttributeSchema,
        mockObjectId,
        validAttributeResponse
      )
      expect(response.statusCode).toBe(200)
      expect(data).toEqual({})
    })
  })

  describe('DELETE', () => {
    test('valid id returns correct data', async () => {
      const mockObjectId = '6408a7156668c5655c25b105'
      const mockDeleteEntity = jest
        .spyOn(MongoDriver, 'deleteEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(async () => {})
      const request = createRequest({
        method: 'DELETE',
        url: `/api/attributes/${mockObjectId}`,
        query: {
          attributeId: mockObjectId,
        },
      })
      const response = createResponse()

      await handler(request, response)

      expect(mockDeleteEntity).toHaveBeenCalledTimes(1)
      expect(mockDeleteEntity).lastCalledWith(AttributeSchema, mockObjectId)
      expect(response.statusCode).toBe(200)
      expect(response._getJSONData().payload).toEqual({})
    })
  })
})
const validAttributeResponse: AttributeResponse = {
  _id: '1',
  name: 'test',
  possibleValues: 'text',
  color: '#000000',
}
