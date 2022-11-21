export interface User {
  _id?: string
  name: string
  email: string
  imageUrl: string
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
  attributeIds: string[]
  attributeValues: string[]
  quantity: number
  assignee: string | User
}

export interface Category {
  _id?: string
  name: string
}

export interface Attribute {
  _id?: string
  name: string
  possibleValues: 'test' | 'number' | string[]
  color: string
}
