import {
  InventoryItemAttributeResponse,
  InventoryItemResponse,
} from 'utils/types'

export interface Data {
  name: string
  attributes?: InventoryItemAttributeResponse[]
  inventoryItem: InventoryItemResponse
  category?: string
  quantity: number
  assignee?: string
  kebab: string
  lowStockThreshold: number
  criticalStockThreshold: number
  _id: string
}
