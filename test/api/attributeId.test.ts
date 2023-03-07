import { ObjectId } from 'mongodb'
import AttributeSchema from 'server/models/Attribute'
import { AttributeResponse } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import handler from 'pages/api/attributes/[attributeId]'
import { serverAuth } from 'utils/auth'

describe('GET by attribute id tests', () => {
  test('valid call', async () => {
    const mockObjectId: string = '3'

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

    jest.mock('utils/auth', () => {
      const module = jest.createMockFromModule<any>('utils/auth').default
      module.serverAuth = jest.fn(() => Promise.resolve())
      return module
    })

    // const mocked = jest.mocked(serverAuth)
    // mocked.mockImplementation(() => Promise.resolve())

    const response = createResponse()

    handler(request, response)

    expect(mockDbCall).lastCalledWith(mockObjectId)
    expect(mockDbCall).toHaveBeenCalledTimes(1)
  })
})

const validAttributeResponse: AttributeResponse = {
  name: 'test',
  possibleValues: 'text',
  color: '#000000',
}
