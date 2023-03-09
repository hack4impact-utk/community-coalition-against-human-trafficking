import { ObjectId } from 'mongodb'
import AttributeSchema, { AttributeDocument } from 'server/models/Attribute'
import { ApiError, AttributeResponse } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import handler from 'pages/api/attributes/[attributeId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import { NextApiRequest, NextApiResponse } from 'next'

beforeAll(() => {
  jest
    .spyOn(auth, 'serverAuth')
    .mockImplementation((_req, _res) => Promise.resolve())
})

describe('api/attributes/[attributeId]', () => {
  test('unauthenticated request returns 401', async () => {
    const mockObjectId = '6408a7156668c5655c25b105'

    jest
      .spyOn(auth, 'serverAuth')
      .mockImplementationOnce(async (_req, _res) => {
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

    test('invalid object id returns 400', async () => {
      const invalidObjectId = '3'

      const request = createRequest({
        method: 'GET',
        url: `/api/attributes/${invalidObjectId}`,
        query: {
          attributeId: invalidObjectId,
        },
      })
      const response = createResponse()

      await handler(request, response)
      const data = response._getJSONData()

      expect(response.statusCode).toBe(400)
      expect(data.message).toBe('Invalid ObjectId Format')
      expect(data.success).toBe(false)
    })
  })

  describe('PUT', () => {
    test('valid call returns correct data', async () => {
      const mockObjectId = '6408a7156668c5655c25b105'

      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(async () => {})

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
})
const validAttributeResponse: AttributeResponse = {
  name: 'test',
  possibleValues: 'text',
  color: '#000000',
}
