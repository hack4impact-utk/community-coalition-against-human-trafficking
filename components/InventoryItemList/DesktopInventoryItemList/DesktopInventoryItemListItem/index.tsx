import WarningIcon from '@mui/icons-material/Warning'
import { TableRow, TableCell, Tooltip, Box, Avatar } from '@mui/material'
import theme from 'utils/theme'
import * as React from 'react'
import InventoryItemListItemKebab from 'components/InventoryItemList/InventoryItemListItemKebab'
import renderAttributeChips from 'utils/renderAttributeChips'
import { InventoryItemResponse } from 'utils/types'
import Grid2 from '@mui/material/Unstable_Grid2'

interface InventoryItemListItemProps {
  inventoryItem: InventoryItemResponse
}

export default function DesktopInventoryItemListItem({
  inventoryItem,
}: InventoryItemListItemProps) {
  // renders the red or yellow warning symbol if necesary
  const renderWarningIcon = (inventoryItem: InventoryItemResponse) => {
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
            visibility:
              inventoryItem.quantity <
              inventoryItem.itemDefinition.lowStockThreshold
                ? 'visible'
                : 'hidden',
            float: 'right',
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
        {inventoryItem.itemDefinition.category?.name || '-'}
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
          <Grid2 xs={6}>{inventoryItem.quantity.toLocaleString()}</Grid2>
          <Grid2 xs="auto">{renderWarningIcon(inventoryItem)}</Grid2>
        </Grid2>
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          wordBreak: 'break-word',
        }}
      >
        {
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                mr: 2,
                visibility: inventoryItem.assignee ? 'default' : 'hidden',
              }}
              src={inventoryItem.assignee?.image || ''}
            />
            {inventoryItem.assignee?.name || '-'}
          </Box>
        }
      </TableCell>
      <TableCell sx={{ width: '10px' }}>
        <InventoryItemListItemKebab inventoryItem={inventoryItem} />
      </TableCell>
    </TableRow>
  )
}
