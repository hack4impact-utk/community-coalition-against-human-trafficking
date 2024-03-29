import { ObjectId } from 'mongodb'
import { createRequest, createResponse } from 'node-mocks-http'
import itemDefinitionHandler from '@api/itemDefinitions/[itemDefinitionId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'
import {
  validItemDefinitionResponse,
  mockObjectId,
  validInventoryItemExistingAttributeValuesResponse,
} from 'test/testData'
import ItemDefinitionSchema from 'server/models/ItemDefinition'
import itemDefinitionAttributeValuesHandler from '@api/itemDefinitions/[itemDefinitionId]/attributeValues'
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
})

describe('GET', () => {
  test('valid call returns correct data', async () => {
    const mockAggregate = (ItemDefinitionSchema.aggregate = jest
      .fn()
      .mockImplementation(async () => [
        validInventoryItemExistingAttributeValuesResponse[0],
      ]))

    const request = createRequest({
      method: 'GET',
      url: `/api/itemDefinitions/${mockObjectId}/attributeValues`,
      query: {
        itemDefinitionId: mockObjectId,
      },
    })

    const response = createResponse()

    await itemDefinitionAttributeValuesHandler(request, response)
    const data = response._getJSONData().payload

    expect(mockAggregate).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(data).toEqual(validInventoryItemExistingAttributeValuesResponse)
  })

  test('no content returns empty', async () => {
    const mockAggregate = (ItemDefinitionSchema.aggregate = jest
      .fn()
      .mockImplementation(async () => []))

    const request = createRequest({
      method: 'GET',
      url: `/api/itemDefinitions/${mockObjectId}/attributeValues`,
      query: {
        itemDefinitionId: mockObjectId,
      },
    })

    const response = createResponse()

    await itemDefinitionAttributeValuesHandler(request, response)
    const data = response._getJSONData().payload

    expect(mockAggregate).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(data).toEqual([])
  })
})
