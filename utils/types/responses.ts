import { Attribute, Category, InventoryItem, ItemDefinition, User } from '.'

export interface UserResponse extends User {
  _id: string
}

export interface ItemDefinitionResponse extends ItemDefinition {
  _id: string
  category?: Category
  attributes?: Attribute[]
}

export interface InventoryItemResponse extends InventoryItem {
  _id: string
  itemDefinition: string
  attributes?: {
    attribute: Attribute
    value: string | number
  }[]
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
