import {
  Attribute,
  Category,
  InventoryItem,
  InventoryItemAttribute,
  ItemDefinition,
  Log,
  NotificationEmail,
  User,
} from '.'

export interface UserResponse extends User {
  _id: string
}

export interface ItemDefinitionResponse extends ItemDefinition {
  _id: string
  category?: CategoryResponse
  attributes?: AttributeResponse[]
}

export interface InventoryItemAttributeResponse extends InventoryItemAttribute {
  attribute: AttributeResponse
}

export interface InventoryItemResponse extends InventoryItem {
  _id: string
  assignee?: UserResponse
  itemDefinition: ItemDefinitionResponse
  attributes?: InventoryItemAttributeResponse[]
}

export interface CategoryResponse extends Category {
  _id: string
}

export interface AttributeResponse extends Attribute {
  _id: string
}

export interface ListAttributeResponse extends AttributeResponse {
  possibleValues: string[]
}

export interface TextAttributeResponse extends AttributeResponse {
  possibleValues: 'text'
}

export interface NumberAttributeResponse extends AttributeResponse {
  possibleValues: 'number'
}

export interface LogResponse extends Log {
  _id: string
  staff: UserResponse
  item: InventoryItemResponse
}

export interface PaginatedResponse<T> {
  total: number
  data: T[]
}

export interface NotificationEmailResponse extends NotificationEmail {
  _id: string
}
export type ServerResponse =
  | UserResponse
  | ItemDefinitionResponse
  | InventoryItemResponse
  | CategoryResponse
  | AttributeResponse
  | LogResponse
