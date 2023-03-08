/// <reference types="jest" />

import { ObjectId } from 'mongodb'
import AttributeSchema from 'server/models/Attribute'
import { AttributeResponse } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import handler from 'pages/api/attributes/[attributeId]'
import * as auth from 'utils/auth'

describe('GET by attribute id tests', () => {
  test('valid call', async () => {
    const mockObjectId = '3'

    const mockDbCall = (AttributeSchema.findById = jest
      .fn()
      .mockImplementation(async () => validAttributeResponse))

    const request = createRequest({
      method: 'GET',
      url: '/api/attributes/3',
    })

    // jest.mock('utils/auth', () => {
    //   return {
    //     serverAuth: jest.fn(),
    //   }
    // })

    // let mockedAuth: jest.Mock
    // mockedAuth = serverAuth as jest.Mock
    // mockedAuth.mockImplementation(() => Promise.resolve())

    jest.spyOn(auth, 'serverAuth').mockImplementation(() => Promise.resolve())

    // const mocked = jest.mocked(serverAuth)
    // mocked.mockImplementation(() => Promise.resolve())

    const response = createResponse()

    const data = await handler(request, response)
    console.log(data)
    expect(mockDbCall).lastCalledWith(mockObjectId)
    expect(mockDbCall).toHaveBeenCalledTimes(1)
  })
})

afterAll(async () => {
  await mongoose.conn.close()
})

const validAttributeResponse: AttributeResponse = {
  name: 'test',
  possibleValues: 'text',
  color: '#000000',
}
