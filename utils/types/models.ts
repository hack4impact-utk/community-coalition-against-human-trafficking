import { InventoryItemResponse, UserResponse } from './responses'

export interface User {
  _id?: string
  name: string
  email: string
  image: string
}

export interface ItemDefinition {
  _id?: string
  name: string
  category?: string | Category
  attributes?: (string | Attribute)[]
  internal: boolean
  lowStockThreshold: number
  criticalStockThreshold: number
}

export interface InventoryItemAttribute {
  attribute: string | Attribute
  value: string | number
}

export interface InventoryItem {
  _id?: string
  itemDefinition: string | ItemDefinition
  attributes?: InventoryItemAttribute[]
  quantity: number
  assignee?: string | User
}

export interface Category {
  _id?: string
  name: string
}

export type AttributePossibleValues = 'text' | 'number' | string[]

export interface Attribute {
  _id?: string
  name: string
  possibleValues: AttributePossibleValues
  color: string
}

export interface ListAttribute extends Attribute {
  possibleValues: string[]
}

export interface TextAttribute extends Attribute {
  possibleValues: 'text'
}

export interface NumberAttribute extends Attribute {
  possibleValues: 'number'
}

export interface Log {
  _id?: string
  staff: string | User
  item: string | InventoryItem
  quantityDelta: number
  date: Date
}

export interface NotificationEmail {
  _id?: string
  emails: string[]
}

export type ServerModel =
  | User
  | ItemDefinition
  | InventoryItem
  | Category
  | Attribute
  | Log
  | NotificationEmail
