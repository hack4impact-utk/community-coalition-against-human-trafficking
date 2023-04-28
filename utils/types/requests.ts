import {
  Attribute,
  Category,
  InventoryItem,
  InventoryItemAttribute,
  InventoryItemResponse,
  ItemDefinition,
  Log,
  User,
  UserResponse,
} from '.'

export type UserPostRequest = UserRequest
export interface UserPutRequest extends UserRequest {
  _id: string
}
export type UserRequest = User

export type ItemDefinitionPostRequest = ItemDefinitionRequest
export interface ItemDefinitionPutRequest extends ItemDefinitionRequest {
  _id: string
}

export interface ItemDefinitionRequest extends ItemDefinition {
  category?: string
  attributes?: string[]
}

export type InventoryItemPostRequest = InventoryItemRequest
export interface InventoryItemPutRequest extends InventoryItemRequest {
  _id: string
}

export interface InventoryItemAttributeRequest extends InventoryItemAttribute {
  attribute: string // the id of the attribute
}

export interface InventoryItemRequest extends InventoryItem {
  itemDefinition: string
  attributes?: InventoryItemAttributeRequest[]
  assignee?: string
}

export type CategoryPostRequest = Omit<Category, '_id'>
export interface CategoryPutRequest extends Category {
  _id: string
}
export type CategoryRequest = Category

export type AttributePostRequest = AttributeRequest
export interface AttributePutRequest extends AttributeRequest {
  _id: string
}
export type AttributeRequest = Attribute

export interface LogRequest extends Log {
  staff: string
  item: string
}
export type LogPostRequest = LogRequest
export interface LogPutRequest extends LogRequest {
  _id: string
}

export interface CheckInOutRequest {
  quantityDelta: number
  date: Date
  staff: string
  inventoryItem: Partial<InventoryItemRequest>
}

export type ServerPostRequest =
  | UserPostRequest
  | ItemDefinitionPostRequest
  | InventoryItemPostRequest
  | CategoryPostRequest
  | AttributePostRequest
  | LogPostRequest

export type ServerPutRequest =
  | UserPutRequest
  | ItemDefinitionPutRequest
  | InventoryItemPutRequest
  | CategoryPutRequest
  | AttributePutRequest
  | LogPutRequest

export type ServerRequest =
  | UserRequest
  | ItemDefinitionRequest
  | InventoryItemRequest
  | CategoryRequest
  | AttributeRequest
  | LogRequest
