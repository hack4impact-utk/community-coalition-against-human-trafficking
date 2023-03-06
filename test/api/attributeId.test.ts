import { ObjectId } from 'mongodb'
import AttributeSchema from 'server/models/Attribute'
import { AttributeResponse } from 'utils/types'
import { createMocks } from 'node-mocks-http'

describe('GET by attribute id tests', () => {
  test('valid call', async () => {
    const mockObjectId: string = '3'

    AttributeSchema.findById = jest
      .fn()
      .mockImplementation(async (id: string) => validAttributeResponse)

    expect(AttributeSchema.findById).lastCalledWith(mockObjectId)
    expect(AttributeSchema.findById).toHaveBeenCalledTimes(1)
  })
})

const validAttributeResponse: AttributeResponse = {
  name: 'test',
  possibleValues: 'text',
  color: '#000000',
}
