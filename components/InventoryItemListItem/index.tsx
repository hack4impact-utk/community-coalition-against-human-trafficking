import { TableRow, TableCell, Chip } from '@mui/material'
import { InventoryItem } from 'utils/types'
import WarningIcon from '@mui/icons-material/Warning'
import { MoreVert } from '@mui/icons-material'
import colors from 'utils/colors'

interface InventoryItemListItemProps {
  inventoryItem: InventoryItem
}

export default function InventoryItemListItem({
  inventoryItem,
}: InventoryItemListItemProps) {
  // ensure that attribute chips are readable
  const getContrastYIQ = (hexcolor: string) => {
    var colorNoHash = hexcolor.substring(1, hexcolor.length - 1)
    var r = parseInt(colorNoHash.substring(0, 2), 16)
    var g = parseInt(colorNoHash.substring(2, 2), 16)
    var b = parseInt(colorNoHash.substring(4, 2), 16)
    var yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 128 ? 'black' : 'white'
  }

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
      inventoryItem.quantity <
      inventoryItem.itemDefinition.criticalStockThreshold
    ) {
      return <WarningIcon fontSize="small" sx={{ color: colors.warning.red }} />
    }

    if (
      inventoryItem.quantity < inventoryItem.itemDefinition.lowStockThreshold
    ) {
      return (
        <WarningIcon fontSize="small" sx={{ color: colors.warning.yellow }} />
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
          width: '10%',
          wordBreak: 'break-all',
        }}
      >
        {typeof inventoryItem.itemDefinition === 'string'
          ? inventoryItem.itemDefinition
          : inventoryItem.itemDefinition.name}
      </TableCell>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.25rem',
          width: '60%',
          wordBreak: 'break-word',
        }}
      >
        {renderAttributeChips(inventoryItem)}
      </TableCell>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '10%',
          wordBreak: 'break-word',
        }}
      >
        {narrowCategory(inventoryItem)}
      </TableCell>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '10%',
          wordBreak: 'break-all',
        }}
      >
        {inventoryItem.quantity}
        {renderWarningIcon(inventoryItem)}
      </TableCell>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '10%',
          wordBreak: 'break-word',
        }}
      >
        {typeof inventoryItem.assignee === 'string'
          ? inventoryItem.assignee
          : inventoryItem.assignee.name}
        <MoreVert sx={{ ml: 'auto' }} />
      </TableCell>
    </TableRow>
  )
}
