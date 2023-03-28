import {
  AttributeResponse,
  CategoryResponse,
  InventoryItemResponse,
  ItemDefinitionResponse,
  UserResponse,
} from 'utils/types'

export const mockObjectId = '6408a7156668c5655c25b105'

export const validAttributeResponse: AttributeResponse[] = [
  {
    _id: '1',
    name: 'test',
    possibleValues: 'text',
    color: '#000000',
  },
]

export const validCategoryResponse: CategoryResponse[] = [
  {
    _id: '1',
    name: 'test',
  },
]

export const validItemDefinitionResponse: ItemDefinitionResponse[] = [
  {
    _id: '1',
    name: 'Test Item',
    internal: false,
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    category: validCategoryResponse[0],
    attributes: validAttributeResponse,
  },
]

export const validUserResponse: UserResponse[] = [
  {
    _id: '1',
    name: 'Test User',
    email: 'test@user.com',
    image: 'https://test.com/image.jpg',
  },
]

export const validInventoryItemResponse: InventoryItemResponse[] = [
  {
    _id: '1',
    itemDefinition: validItemDefinitionResponse[0],
    quantity: 10,
    attributes: [
      {
        attribute: validAttributeResponse[0],
        value: 'val',
      },
    ],
    assignee: validUserResponse[0],
  },
]
