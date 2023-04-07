import { Attribute, Category, InventoryItem, ItemDefinition, User } from '.'

export interface UserResponse extends User {
  _id: string
}

export interface ItemDefinitionResponse extends ItemDefinition {
  _id: string
  category?: CategoryResponse
  attributes?: AttributeResponse[]
}

export interface InventoryItemResponse extends InventoryItem {
  [x: string]: any
  _id: string
  itemDefinition: ItemDefinitionResponse
  attributes?: {
    attribute: AttributeResponse
    value: string | number
  }[]
  assignee?: User
}

export interface CategoryResponse extends Category {
  _id: string
}

export interface AttributeResponse extends Attribute {
  _id: string
}

export type ServerResponse =
  | UserResponse
  | ItemDefinitionResponse
  | InventoryItemResponse
  | CategoryResponse
  | AttributeResponse
