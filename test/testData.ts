import {
  AttributeRequest,
  AttributeResponse,
  CategoryRequest,
  CategoryResponse,
  InventoryItemRequest,
  InventoryItemResponse,
  ItemDefinitionRequest,
  ItemDefinitionResponse,
  UserRequest,
  UserResponse,
} from 'utils/types'

export const mockObjectId = '6408a7156668c5655c25b105'

export const validAttributeRequest: AttributeRequest = {
  name: 'test',
  possibleValues: 'text',
  color: '#000000',
}

export const validAttributeResponse: AttributeResponse[] = [
  {
    ...validAttributeRequest,
    _id: '1',
  },
]

export const validCategoryRequest: CategoryRequest = {
  name: 'test',
}

export const validCategoryResponse: CategoryResponse[] = [
  {
    ...validCategoryRequest,
    _id: '1',
  },
]

export const validItemDefinitionRequest: ItemDefinitionRequest = {
  name: 'Test Item',
  internal: false,
  lowStockThreshold: 10,
  criticalStockThreshold: 5,
  category: validCategoryResponse[0]._id,
  attributes: [validAttributeResponse[0]._id],
}

export const validItemDefinitionResponse: ItemDefinitionResponse[] = [
  {
    ...validItemDefinitionRequest,
    _id: '1',
    category: validCategoryResponse[0],
    attributes: validAttributeResponse,
  },
]

export const validUserRequest: UserRequest = {
  name: 'Test User',
  email: 'test@user.com',
  image: 'https://test.com/image.jpg',
}

export const validUserResponse: UserResponse[] = [
  {
    ...validUserRequest,
    _id: '1',
  },
]

export const validInventoryItemRequest: InventoryItemRequest = {
  _id: '1',
  itemDefinition: validItemDefinitionResponse[0]._id,
  quantity: 10,
  attributes: [
    {
      attribute: validAttributeResponse[0]._id,
      value: 'val',
    },
  ],
  assignee: validUserResponse[0]._id,
}

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
