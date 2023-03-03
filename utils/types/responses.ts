import { Attribute, Category, InventoryItem, ItemDefinition, User } from '.'

export interface UserResponse extends User {}

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

export interface CategoryResponse extends Category {}

export interface AttributeResponse extends Attribute {}

export type ServerResponse =
  | UserResponse
  | ItemDefinitionResponse
  | InventoryItemResponse
  | CategoryResponse
  | AttributeResponse
