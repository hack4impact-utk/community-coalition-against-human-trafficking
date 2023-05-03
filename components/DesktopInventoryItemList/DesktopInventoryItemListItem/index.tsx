import WarningIcon from '@mui/icons-material/Warning'
import { TableRow, TableCell, Tooltip, Box } from '@mui/material'
import theme from 'utils/theme'
import * as React from 'react'
import InventoryItemListItemKebab from 'components/InventoryItemListItemKebab'
import renderAttributeChips from 'utils/renderAttributeChips'
import { InventoryItemResponse } from 'utils/types'

interface InventoryItemListItemProps {
  inventoryItem: InventoryItemResponse
}

export default function DesktopInventoryItemListItem({
  inventoryItem,
}: InventoryItemListItemProps) {
  // renders the red or yellow warning symbol if necesary
  const renderWarningIcon = (inventoryItem: InventoryItemResponse) => {
    if (
      inventoryItem.quantity < inventoryItem.itemDefinition.lowStockThreshold
    ) {
      return (
        <Tooltip
          title={
            inventoryItem.quantity <
            inventoryItem.itemDefinition.criticalStockThreshold
              ? 'This item has critically low stock.'
              : 'This item has low stock.'
          }
        >
          <WarningIcon
            fontSize="small"
            sx={{
              ml: 1,
              color:
                inventoryItem.quantity <
                inventoryItem.itemDefinition.criticalStockThreshold
                  ? theme.palette.error.main
                  : theme.palette.warning.light,
            }}
          />
        </Tooltip>
      )
    }
  }

  return (
    <TableRow>
      <TableCell
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          wordBreak: 'break-word',
        }}
      >
        {inventoryItem.itemDefinition.name}
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          alignContent: 'center',
          gap: '0.25rem',
        }}
      >
        {renderAttributeChips(inventoryItem.attributes)}
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {inventoryItem.itemDefinition.category?.name}
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'baseline',
          justifyContent: 'center',
          wordBreak: 'break-word',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          {inventoryItem.quantity.toLocaleString()}
          {renderWarningIcon(inventoryItem)}
        </span>
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          wordBreak: 'break-word',
        }}
      >
        {inventoryItem.assignee ? inventoryItem.assignee.name : ''}
      </TableCell>
      <TableCell sx={{ width: '10px' }}>
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <InventoryItemListItemKebab inventoryItem={inventoryItem} />
        </Box>
      </TableCell>
    </TableRow>
  )
}
