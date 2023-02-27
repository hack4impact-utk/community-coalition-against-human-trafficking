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

export interface InventoryItem {
  _id?: string
  itemDefinition: string | ItemDefinition
  attributes?: {
    attribute: string | Attribute
    value: string | number
  }[]
  quantity: number
  assignee?: string | User
}

export interface Category {
  _id?: string
  name: string
}

export interface Attribute {
  _id?: string
  name: string
  possibleValues: 'text' | 'number' | string[]
  color: string
}

export type ServerModel =
  | User
  | ItemDefinition
  | InventoryItem
  | Category
  | Attribute
