import WarningIcon from '@mui/icons-material/Warning'
import {
  TableRow,
  TableCell,
  Tooltip,
  Box,
  Unstable_Grid2 as Grid2,
} from '@mui/material'
import theme from 'utils/theme'
import * as React from 'react'
import InventoryItemListItemKebab from 'components/InventoryItemList/InventoryItemListItemKebab'
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
    return (
      <Tooltip
        title={
          inventoryItemData.quantity < inventoryItemData.criticalStockThreshold
            ? 'This item has critically low stock.'
            : 'This item has low stock.'
        }
      >
        <WarningIcon
          fontSize="small"
          sx={{
            visibility:
              inventoryItemData.quantity < inventoryItemData.lowStockThreshold
                ? 'visible'
                : 'hidden',
            float: 'right',
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
        align="right"
      >
        <Grid2 container gap={1} justifyContent="flex-end">
          <Grid2 xs={6}>{inventoryItemData.quantity.toLocaleString()}</Grid2>
          <Grid2 xs="auto">{renderWarningIcon(inventoryItemData)}</Grid2>
        </Grid2>
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
