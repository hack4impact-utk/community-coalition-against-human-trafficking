import WarningIcon from '@mui/icons-material/Warning'
import { TableRow, TableCell, Chip, Tooltip, Box } from '@mui/material'
import theme from 'utils/theme'
import getContrastYIQ from 'utils/getContrastYIQ'
import * as React from 'react'
import InventoryItemListItemKebab from 'components/InventoryItemListItemKebab'
import { Data } from '../types'

interface InventoryItemListItemProps {
  inventoryItem: Data
}

export default function DesktopInventoryItemListItem({
  inventoryItem,
}: InventoryItemListItemProps) {
  // renders the red or yellow warning symbol if necesary
  const renderWarningIcon = (inventoryItem: Data) => {
    if (inventoryItem.quantity < inventoryItem.lowStockThreshold) {
      return (
        <Tooltip
          title={
            inventoryItem.quantity < inventoryItem.criticalStockThreshold
              ? 'This item has critically low stock.'
              : 'This item has low stock.'
          }
        >
          <WarningIcon
            fontSize="small"
            sx={{
              ml: 1,
              color:
                inventoryItem.quantity < inventoryItem.criticalStockThreshold
                  ? theme.palette.error.main
                  : theme.palette.warning.light,
            }}
          />
        </Tooltip>
      )
    }
  }

  const renderAttributeChips = (inventoryItem: Data) => {
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
              ml: 1,
              my: 0.5,
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
          sx={{
            ml: 1,
            my: 0.5,
          }}
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
        {inventoryItem.name}
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
      >
        {inventoryItem.category}
      </TableCell>
      <TableCell
        sx={{
          // display: 'flex',
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
        {inventoryItem.assignee ? inventoryItem.assignee : ''}
      </TableCell>
      <TableCell sx={{ width: '10px' }}>
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <InventoryItemListItemKebab
            inventoryItem={inventoryItem.inventoryItem}
          />
        </Box>
      </TableCell>
    </TableRow>
  )
}
