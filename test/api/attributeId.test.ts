import { ObjectId } from 'mongodb'
import AttributeSchema from 'server/models/Attribute'
import { AttributeResponse } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import handler from 'pages/api/attributes/[attributeId]'
import * as serverAuth from 'utils/auth'

describe('GET by attribute id tests', () => {
  test('valid call', async () => {
    const mockObjectId: string = '3'

    const mockDbCall = (AttributeSchema.findById = jest
      .fn()
      .mockImplementation(async () => validAttributeResponse))

    jest
      .spyOn(serverAuth, 'serverAuth')
      .mockImplementation(() => Promise.resolve())

    const request = createRequest({
      method: 'GET',
      url: '/api/attributes/3',
    })

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
