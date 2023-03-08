/// <reference types="jest" />

import { ObjectId } from 'mongodb'
import AttributeSchema from 'server/models/Attribute'
import { AttributeResponse } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import handler from 'pages/api/attributes/[attributeId]'
import * as auth from 'utils/auth'
import * as MongoDriver from 'server/actions/MongoDriver'
import * as apiValidator from 'utils/apiValidators'

describe('GET by attribute id tests', () => {
  test('valid call', async () => {
    const mockObjectId = '36408a7156668c5655c25b105'

    const mockDbCall = (AttributeSchema.findById = jest
      .fn()
      .mockImplementation(async () => validAttributeResponse))

    const request = createRequest({
      method: 'GET',
      url: `/api/attributes/${mockObjectId}`,
      query: {
        attributeId: mockObjectId,
      },
    })

    // jest.mock('utils/auth', () => {
    //   return {
    //     serverAuth: jest.fn(),
    //   }
    // })

    // let mockedAuth: jest.Mock
    // mockedAuth = serverAuth as jest.Mock
    // mockedAuth.mockImplementation(() => Promise.resolve())

    const serverAuthMock = jest
      .spyOn(auth, 'serverAuth')
      .mockImplementation((_req, _res) => Promise.resolve())
    const validatorMock = jest
      .spyOn(apiValidator, 'apiObjectIdValidation')
      .mockImplementation()
    // const mockedGetEntity = jest.spyOn(MongoDriver, 'getEntity')

    // const mocked = jest.mocked(serverAuth)
    // mocked.mockImplementation(() => Promise.resolve())

    const response = createResponse()

    expect(serverAuthMock).toHaveBeenCalledTimes(1)
    expect(validatorMock).toHaveBeenCalledTimes(1)
    expect(validatorMock).lastCalledWith(mockObjectId)
    // expect(mockedGetEntity).toHaveBeenCalledTimes(1)
    expect(mockDbCall).toHaveBeenCalledTimes(1)
    expect(mockDbCall).lastCalledWith(mockObjectId)
  })
})

const validAttributeResponse: AttributeResponse = {
  name: 'test',
  possibleValues: 'text',
  color: '#000000',
}
