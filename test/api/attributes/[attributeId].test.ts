import { ObjectId } from 'mongodb'
import AttributeSchema, { AttributeDocument } from 'server/models/Attribute'
import { ApiError } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import attributeHandler from 'pages/api/attributes/[attributeId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import mongoose from 'mongoose'
import { errors } from 'utils/constants/errors'
import {
  validAttributeResponse,
  mockObjectId,
  validAttributePutRequest,
  validAppConfigResponse,
} from 'test/testData'
import urls from 'utils/urls'
import * as AppConfigActions from 'server/actions/AppConfig'
import { serverAuthMock } from 'test/helpers/serverAuth'

beforeAll(() => {
  jest
    .spyOn(auth, 'serverAuth')
    .mockImplementation(() => Promise.resolve(serverAuthMock))

  jest.spyOn(apiValidator, 'apiObjectIdValidation').mockImplementation()
})

// restore mocked implementations and close db connections
afterAll(() => {
  jest.restoreAllMocks()
  mongoose.connection.close()
})

describe('api/attributes/[attributeId]', () => {
  test('thrown error is caught, response is unsuccessful and shows correct error message', async () => {
    jest.spyOn(auth, 'serverAuth').mockImplementationOnce(async () => {
      throw new ApiError(401, errors.unauthorized)
    })

    const request = createRequest({
      method: 'GET',
      url: urls.api.attributes.attribute(mockObjectId),
      query: {
        attributeId: mockObjectId,
      },
    })
    const response = createResponse()

    await attributeHandler(request, response)

    const data = response._getJSONData()

    expect(response.statusCode).toBe(401)
    expect(data.message).toBe(errors.unauthorized)
    expect(data.success).toBe(false)
  })

  test('unsupported method returns 405', async () => {
    const request = createRequest({
      method: 'POST',
      url: urls.api.attributes.attribute(mockObjectId),
      query: {
        attributeId: mockObjectId,
      },
    })
    const response = createResponse()

    await attributeHandler(request, response)

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
            validAttributeResponse[0] as AttributeDocument & { _id: ObjectId }
        )

      const request = createRequest({
        method: 'GET',
        url: urls.api.attributes.attribute(mockObjectId),
        query: {
          attributeId: mockObjectId,
        },
      })

      const response = createResponse()

      await attributeHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockGetEntity).toHaveBeenCalledTimes(1)
      expect(mockGetEntity).lastCalledWith(AttributeSchema, mockObjectId)
      expect(response.statusCode).toBe(200)
      expect(data).toEqual(validAttributeResponse[0])
    })
  })

  describe('PUT', () => {
    test('valid call returns correct data', async () => {
      const mockUpdateEntity = jest
        .spyOn(MongoDriver, 'updateEntity')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(
          async () =>
            validAttributeResponse[0] as AttributeDocument & {
              _id: ObjectId
            }
        )
      const mockApiAttributeValidation = jest
        .spyOn(apiValidator, 'apiAttributeValidation')
        .mockImplementation()

      const request = createRequest({
        method: 'PUT',
        url: urls.api.attributes.attribute(mockObjectId),
        query: {
          attributeId: mockObjectId,
        },
        body: validAttributePutRequest,
      })

      const response = createResponse()

      await attributeHandler(request, response)
      const data = response._getJSONData().payload

      expect(mockApiAttributeValidation).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).toHaveBeenCalledTimes(1)
      expect(mockUpdateEntity).lastCalledWith(
        AttributeSchema,
        mockObjectId,
        validAttributePutRequest
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
            ({ collection: { collectionName: 'attributes' } } as Awaited<
              ReturnType<typeof MongoDriver.softDeleteEntity>
            >)
        )

      jest
        .spyOn(AppConfigActions, 'getAppConfigs')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(async () => validAppConfigResponse)

      const request = createRequest({
        method: 'DELETE',
        url: urls.api.attributes.attribute(mockObjectId),
        query: {
          attributeId: mockObjectId,
        },
      })
      const response = createResponse()

      await attributeHandler(request, response)

      expect(mockDeleteEntity).toHaveBeenCalledTimes(1)
      expect(mockDeleteEntity).lastCalledWith(AttributeSchema, mockObjectId)
      expect(response.statusCode).toBe(200)
      expect(response._getJSONData().payload).toEqual({})
    })
  })
})
