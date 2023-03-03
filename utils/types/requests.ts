import { Attribute, Category, InventoryItem, ItemDefinition, User } from '.'

export interface UserRequest extends User {}

export interface ItemDefinitionRequest extends ItemDefinition {
  category?: string
  attributes?: string[]
}

export interface InventoryItemRequest extends InventoryItem {
  itemDefinition: string
  attributes?: {
    attribute: string
    value: string | number
  }[]
}

export interface CategoryRequest extends Category {}

export interface AttributeRequest extends Attribute {}

export type ServerRequest =
  | UserRequest
  | ItemDefinitionRequest
  | InventoryItemRequest
  | CategoryRequest
  | AttributeRequest
