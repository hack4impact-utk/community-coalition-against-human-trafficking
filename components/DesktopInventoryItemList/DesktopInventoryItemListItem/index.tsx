import WarningIcon from '@mui/icons-material/Warning'
import { TableRow, TableCell, Tooltip, Box } from '@mui/material'
import theme from 'utils/theme'
import * as React from 'react'
import InventoryItemListItemKebab from 'components/InventoryItemListItemKebab'
import { Data } from '../types'
import renderAttributeChips from 'utils/renderAttributeChips'

interface InventoryItemListItemProps {
  inventoryItemData: Data
}

export default function DesktopInventoryItemListItem({
  inventoryItemData: inventoryItemData,
}: InventoryItemListItemProps) {
  // renders the red or yellow warning symbol if necesary
  const renderWarningIcon = (inventoryItemData: Data) => {
    if (inventoryItemData.quantity < inventoryItemData.lowStockThreshold) {
      return (
        <Tooltip
          title={
            inventoryItemData.quantity <
            inventoryItemData.criticalStockThreshold
              ? 'This item has critically low stock.'
              : 'This item has low stock.'
          }
        >
          <WarningIcon
            fontSize="small"
            sx={{
              ml: 1,
              color:
                inventoryItemData.quantity <
                inventoryItemData.criticalStockThreshold
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
        {inventoryItemData.name}
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          alignContent: 'center',
          gap: '0.25rem',
        }}
      >
        {renderAttributeChips(inventoryItemData.attributes)}
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {inventoryItemData.category}
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
          {inventoryItemData.quantity.toLocaleString()}
          {renderWarningIcon(inventoryItemData)}
        </span>
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          wordBreak: 'break-word',
        }}
      >
        {inventoryItemData.assignee ? inventoryItemData.assignee : ''}
      </TableCell>
      <TableCell sx={{ width: '10px' }}>
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <InventoryItemListItemKebab
            inventoryItem={inventoryItemData.inventoryItem}
          />
        </Box>
      </TableCell>
    </TableRow>
  )
}
