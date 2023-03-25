import {
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  Box,
} from '@mui/material'
import { InventoryItemResponse } from 'utils/types'
import WarningIcon from '@mui/icons-material/Warning'
import { MoreVert } from '@mui/icons-material'
import theme from 'utils/theme'
import getContrastYIQ from 'utils/getContrastYIQ'
import * as React from 'react'

interface InventoryItemListItemProps {
  inventoryItem: InventoryItemResponse
}

const settings = ['Check in', 'Check out', 'Delete']

export default function InventoryItemListItem({
  inventoryItem,
}: InventoryItemListItemProps) {
  // kebab menu functionality
  const [anchorElKebab, setAnchorElKebab] = React.useState<null | HTMLElement>(
    null
  )

  const handleOpenKebabMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElKebab(event.currentTarget)
  }

  const handleCloseKebabMenu = () => {
    setAnchorElKebab(null)
  }

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
        {inventoryItem.itemDefinition.name}
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
      ></TableCell>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100px',
          wordBreak: 'break-word',
        }}
      >
        {inventoryItem.quantity.toLocaleString()}
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
        {inventoryItem.assignee ? inventoryItem.assignee.name : ''}
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <IconButton onClick={handleOpenKebabMenu}>
            <MoreVert sx={{ color: theme.palette.grey['500'] }} />
          </IconButton>
          <Menu
            sx={{ mt: 5 }}
            id="kebab-menu"
            anchorEl={anchorElKebab}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElKebab)}
            onClose={handleCloseKebabMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={() => handleCloseKebabMenu()}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </TableCell>
    </TableRow>
  )
}
