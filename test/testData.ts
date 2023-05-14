import {
  AttributePostRequest,
  AttributePutRequest,
  AttributeResponse,
  CategoryPostRequest,
  CategoryPutRequest,
  CategoryResponse,
  ItemDefinitionPostRequest,
  ItemDefinitionPutRequest,
  ItemDefinitionResponse,
  UserPostRequest,
  UserPutRequest,
  UserResponse,
  InventoryItemPostRequest,
  InventoryItemPutRequest,
  InventoryItemResponse,
  LogPostRequest,
  LogPutRequest,
  LogResponse,
  CheckInOutRequest,
  NotificationEmailPostRequest,
  NotificationEmailPutRequest,
  NotificationEmailResponse,
  PaginatedResponse,
  InventoryItemExistingAttributeValuesResponse,
} from 'utils/types'

export const mockObjectId = '6408a7156668c5655c25b105'

export const validAttributePostRequest: AttributePostRequest = {
  name: 'test',
  possibleValues: 'text',
  color: '#000000',
}

export const validAttributePutRequest: AttributePutRequest = {
  ...validAttributePostRequest,
  _id: mockObjectId,
}

export const validAttributeResponse: AttributeResponse[] = [
  {
    ...validAttributePostRequest,
    _id: mockObjectId,
  },
]

export const validCategoryPostRequest: CategoryPostRequest = {
  name: 'test',
}

export const validCategoryPutRequest: CategoryPutRequest = {
  ...validCategoryPostRequest,
  _id: mockObjectId,
}

export const validCategoryResponse: CategoryResponse[] = [
  {
    ...validCategoryPostRequest,
    _id: mockObjectId,
  },
]

export const validItemDefinitionPostRequest: ItemDefinitionPostRequest = {
  name: 'Test Item',
  internal: false,
  lowStockThreshold: 10,
  criticalStockThreshold: 5,
  category: validCategoryResponse[0]._id,
  attributes: [validAttributeResponse[0]._id],
}

export const validItemDefinitionPutRequest: ItemDefinitionPutRequest = {
  ...validItemDefinitionPostRequest,
  _id: mockObjectId,
}

export const validItemDefinitionResponse: ItemDefinitionResponse[] = [
  {
    ...validItemDefinitionPostRequest,
    _id: mockObjectId,
    category: validCategoryResponse[0],
    attributes: validAttributeResponse,
  },
]

export const validInventoryItemExistingAttributeValuesResponse: InventoryItemExistingAttributeValuesResponse[] =
  [
    {
      _id: mockObjectId,
      values: ['val1', 2],
    },
  ]

export const validUserPostRequest: UserPostRequest = {
  name: 'Test User',
  email: 'test@user.com',
  image: 'https://test.com/image.jpg',
}

export const validUserPutRequest: UserPutRequest = {
  ...validUserPostRequest,
  _id: mockObjectId,
}

export const validUserResponse: UserResponse[] = [
  {
    ...validUserPostRequest,
    _id: mockObjectId,
  },
]

export const validInventoryItemPostRequest: InventoryItemPostRequest = {
  _id: mockObjectId,
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

export const validInventoryItemPutRequest: InventoryItemPutRequest = {
  ...validInventoryItemPostRequest,
  _id: mockObjectId,
}

export const validInventoryItemResponse: InventoryItemResponse[] = [
  {
    _id: mockObjectId,
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

export const validLogPostRequest: LogPostRequest = {
  staff: validUserResponse[0]._id,
  item: validInventoryItemResponse[0]._id,
  quantityDelta: 1,
  date: new Date(),
}

export const validLogPutRequest: LogPutRequest = {
  ...validLogPostRequest,
  _id: mockObjectId,
}

export const validLogResponse: LogResponse[] = [
  {
    _id: mockObjectId,
    item: validInventoryItemResponse[0],
    quantityDelta: 1,
    staff: validUserResponse[0],
    date: new Date(),
  },
]

export const validPaginatedResponse: PaginatedResponse<LogResponse> = {
  total: 1,
  data: validLogResponse,
}

export const validCheckInOutRequest: CheckInOutRequest = {
  quantityDelta: 1,
  date: new Date(),
  staff: mockObjectId,
  inventoryItem: validInventoryItemPostRequest,
}

export const validNotificationEmailPostRequest: NotificationEmailPostRequest = {
  emails: ['test@user.com', 'test2@gmail.com'],
}

export const validNotificationEmailPutRequest: NotificationEmailPutRequest = {
  ...validNotificationEmailPostRequest,
  _id: mockObjectId,
}

export const validNotificationEmailResponse: NotificationEmailResponse[] = [
  {
    ...validNotificationEmailPostRequest,
    _id: mockObjectId,
  },
]
