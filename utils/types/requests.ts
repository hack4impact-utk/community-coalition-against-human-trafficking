import { Attribute, Category, InventoryItem, ItemDefinition, User } from '.'

export type UserPostRequest = User
export interface UserPutRequest extends User {
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

export interface InventoryItemAttributeRequest {
  attribute: string
  value: string | number
}

export interface InventoryItemRequest extends InventoryItem {
  itemDefinition: string
  attributes?: InventoryItemAttributeRequest[]
}

export type CategoryPostRequest = Omit<Category, '_id'>
export interface CategoryPutRequest extends Category {
  _id: string
}
export type CategoryRequest = Category

export type AttributePostRequest = Attribute
export interface AttributePutRequest extends Attribute {
  _id: string
}
export type AttributeRequest = Attribute

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
