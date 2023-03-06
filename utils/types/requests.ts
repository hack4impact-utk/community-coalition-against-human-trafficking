import { Attribute, Category, InventoryItem, ItemDefinition, User } from '.'

export interface UserPostRequest extends User {}
export interface UserPutRequest extends User {
  _id: string
}
export interface UserRequest extends User {}

export interface ItemDefinitionPostRequest extends ItemDefinitionRequest {}
export interface ItemDefinitionPutRequest extends ItemDefinitionRequest {
  _id: string
}

export interface ItemDefinitionRequest extends ItemDefinition {
  category?: string
  attributes?: string[]
}

export interface InventoryItemPostRequest extends InventoryItemRequest {}
export interface InventoryItemPutRequest extends InventoryItemRequest {
  _id: string
}

export interface InventoryItemRequest extends InventoryItem {
  itemDefinition: string
  attributes?: {
    attribute: string
    value: string | number
  }[]
}

export interface CategoryPostRequest extends Category {}
export interface CategoryPutRequest extends Category {
  _id: string
}
export interface CategoryRequest extends Category {}

export interface AttributePostRequest extends Attribute {}
export interface AttributePutRequest extends Attribute {
  _id: string
}
export interface AttributeRequest extends Attribute {}

export type ServerPostRequest =
  | UserPostRequest
  | ItemDefinitionPostRequest
  | InventoryItemPostRequest
  | CategoryPostRequest
  | AttributePostRequest

export type ServerPutRequest =
  | UserPutRequest
  | ItemDefinitionPutRequest
  | InventoryItemPutRequest
  | CategoryPutRequest
  | AttributePutRequest

export type ServerRequest =
  | UserRequest
  | ItemDefinitionRequest
  | InventoryItemRequest
  | CategoryRequest
  | AttributeRequest
