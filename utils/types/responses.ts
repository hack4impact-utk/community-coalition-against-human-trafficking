import { Attribute, Category, InventoryItem, ItemDefinition, User } from '.'

export type UserResponse = User

export interface ItemDefinitionResponse extends ItemDefinition {
  category?: Category
  attributes?: Attribute[]
}

export interface InventoryItemResponse extends InventoryItem {
  itemDefinition: string
  attributes?: {
    attribute: Attribute
    value: string | number
  }[]
}

export type CategoryResponse = Category

export type AttributeResponse = Attribute

export type ServerResponse =
  | UserResponse
  | ItemDefinitionResponse
  | InventoryItemResponse
  | CategoryResponse
  | AttributeResponse
