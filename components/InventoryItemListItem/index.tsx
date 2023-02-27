import { TableRow, TableCell } from '@mui/material'
import { InventoryItem } from 'utils/types'
import WarningIcon from '@mui/icons-material/Warning'

interface InventoryItemListItemProps {
  inventoryItem: InventoryItem
}

export default function InventoryItemListItem({
  inventoryItem,
}: InventoryItemListItemProps) {
  const getCategory = (inventoryItem: InventoryItem) => {
    // needed to deal with the possible union types defined in the database schema
    if (
      typeof inventoryItem.itemDefinition === 'string' ||
      !inventoryItem.itemDefinition.category
    ) {
      return ' '
    }

    if (typeof inventoryItem.itemDefinition.category === 'string') {
      return inventoryItem.itemDefinition.category
    }

    return inventoryItem.itemDefinition.category.name
  }

  const renderWarningIcon = (inventoryItem: InventoryItem) => {
    // renders the red or yellow warning symbol if necesary
    if (typeof inventoryItem.itemDefinition === 'string') {
      return
    }

    if (
      inventoryItem.quantity <
      inventoryItem.itemDefinition.criticalStockThreshold
    ) {
      return <WarningIcon fontSize="small" sx={{ color: '#FF0F0F' }} /> // red from Figma
    }

    if (
      inventoryItem.quantity < inventoryItem.itemDefinition.lowStockThreshold
    ) {
      return <WarningIcon fontSize="small" sx={{ color: '#FFDB58' }} /> // mustard yellow placeholder
    }
  }

  return (
    <TableRow>
      <TableCell>
        {typeof inventoryItem.itemDefinition === 'string'
          ? inventoryItem.itemDefinition
          : inventoryItem.itemDefinition.name}
      </TableCell>
      <TableCell></TableCell>
      <TableCell>{getCategory(inventoryItem)}</TableCell>
      <TableCell sx={{ display: 'flex' }}>
        {inventoryItem.quantity}
        {renderWarningIcon(inventoryItem)}
      </TableCell>
      <TableCell>
        {typeof inventoryItem.assignee === 'string'
          ? inventoryItem.assignee
          : inventoryItem.assignee.name}
      </TableCell>
    </TableRow>
  )
}
