import { InventoryItem } from 'utils/types'
import WarningIcon from '@mui/icons-material/Warning'
import { TableRow, TableCell, Chip, Tooltip, Box } from '@mui/material'
import { InventoryItemResponse } from 'utils/types'
import theme from 'utils/theme'
import getContrastYIQ from 'utils/getContrastYIQ'
import * as React from 'react'
import InventoryItemListItemKebab from 'components/InventoryItemListItemKebab'

interface InventoryItemListItemProps {
  inventoryItem: InventoryItemResponse
}

export default function InventoryItemListItem({
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

  const renderAttributeChips = (inventoryItem: InventoryItemResponse) => {
    return inventoryItem.attributes?.map((itemAttribute, i) => {
      // attributes that are strings or numbers show the attribute name
      // attributes that are list types do not

      if (itemAttribute.attribute.possibleValues instanceof Array) {
        return (
          <Chip
            size="small"
            label={`${itemAttribute.value}`}
            key={i}
            sx={{
              backgroundColor: itemAttribute.attribute.color,
              '& .MuiChip-label': {
                color: getContrastYIQ(itemAttribute.attribute.color),
              },
            }}
          />
        )
      }

      return (
        <Chip
          size="small"
          label={`${itemAttribute.attribute.name}: ${itemAttribute.value}`}
          key={i}
        />
      )
    })
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
        {renderAttributeChips(inventoryItem)}
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      ></TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          wordBreak: 'break-word',
        }}
      >
        {inventoryItem.quantity.toLocaleString()}
        {renderWarningIcon(inventoryItem)}
      </TableCell>
      <TableCell
        sx={{
          alignItems: 'center',
          wordBreak: 'break-word',
        }}
      >
        {typeof inventoryItem.assignee === 'string'
          ? inventoryItem.assignee
          : inventoryItem.assignee
          ? inventoryItem.assignee.name
          : ''}
      </TableCell>
      <TableCell sx={{ width: '10px' }}>
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <InventoryItemListItemKebab inventoryItem={inventoryItem} />
        </Box>
      </TableCell>
    </TableRow>
  )
}
