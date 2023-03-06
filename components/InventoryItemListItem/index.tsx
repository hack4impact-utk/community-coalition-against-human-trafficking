import { TableRow, TableCell, Chip, IconButton } from '@mui/material'
import { InventoryItem } from 'utils/types'
import WarningIcon from '@mui/icons-material/Warning'
import { InventoryOutlined, MoreVert } from '@mui/icons-material'
import theme from 'utils/theme'
import getContrastYIQ from 'utils/getContrastYIQ'

interface InventoryItemListItemProps {
  inventoryItem: InventoryItem
}

export default function InventoryItemListItem({
  inventoryItem,
}: InventoryItemListItemProps) {
  // TODO: fix when the database schema is split between request and response types
  // needed to deal with the possible union types defined in the database schema
  const narrowCategory = (inventoryItem: InventoryItem) => {
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

  // renders the red or yellow warning symbol if necesary
  const renderWarningIcon = (inventoryItem: InventoryItem) => {
    if (typeof inventoryItem.itemDefinition === 'string') {
      return
    }

    if (
      inventoryItem.quantity < inventoryItem.itemDefinition.lowStockThreshold
    ) {
      return (
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
      )
    }
  }

  const renderAttributeChips = (inventoryItem: InventoryItem) => {
    return inventoryItem.attributes?.map((itemAttribute, i) => {
      // attributes that are strings or numbers show the attribute name
      // attributes that are list types do not

      // TODO: remove this if statement after database types are split between
      // response and request
      if (typeof itemAttribute.attribute === 'string') {
        return (
          <Chip
            size="small"
            label={`${itemAttribute.attribute}: ${itemAttribute.value}`}
            key={i}
          />
        )
      }

      return (
        <Chip
          size="small"
          label={
            typeof itemAttribute.attribute.possibleValues === 'object'
              ? `${itemAttribute.value}`
              : `${itemAttribute.attribute.name}: ${itemAttribute.value}`
          }
          key={i}
          sx={{
            backgroundColor: itemAttribute.attribute.color,
            '& .MuiChip-label': {
              color: getContrastYIQ(itemAttribute.attribute.color),
            },
          }}
        />
      )
    })
  }

  return (
    <TableRow sx={{ display: 'flex' }}>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100px',
          wordBreak: 'break-word',
        }}
      >
        {/* TODO: fix when the database schema is split between request and response types */}
        {typeof inventoryItem.itemDefinition === 'string'
          ? inventoryItem.itemDefinition
          : inventoryItem.itemDefinition.name}
      </TableCell>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          flexWrap: 'wrap',
          gap: '0.25rem',
          width: '400px',
        }}
      >
        {renderAttributeChips(inventoryItem)}
      </TableCell>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100px',
        }}
      >
        {narrowCategory(inventoryItem)}
      </TableCell>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100px',
          wordBreak: 'break-word',
        }}
      >
        {inventoryItem.quantity}
        {renderWarningIcon(inventoryItem)}
      </TableCell>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '200px',
          wordBreak: 'break-word',
        }}
      >
        {typeof inventoryItem.assignee === 'string'
          ? inventoryItem.assignee
          : inventoryItem.assignee.name}
        <IconButton sx={{ ml: 'auto' }}>
          <MoreVert sx={{ color: theme.palette.grey['500'] }} />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
