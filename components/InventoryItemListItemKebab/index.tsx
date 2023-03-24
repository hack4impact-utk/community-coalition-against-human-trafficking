import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import theme from 'utils/theme'
import { InventoryItem } from 'utils/types'

interface InventoryItemListItemKebabOption {
  name: string
  onClick: () => void
}

interface InventoryItemListItemKebabProps {
  inventoryItem: InventoryItem
}

const settings: InventoryItemListItemKebabOption[] = [
  {
    name: 'Check in',
    onClick: () => console.log('check in'),
  },
  {
    name: 'Check out',
    onClick: () => console.log('check out'),
  },
  {
    name: 'Delete',
    onClick: () => console.log('delete'),
  },
]

export default function InventoryItemListItemKebab({
  inventoryItem,
}: InventoryItemListItemKebabProps) {
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
  return (
    <>
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
          <MenuItem
            key={setting.name}
            onClick={() => {
              setting.onClick()
              handleCloseKebabMenu()
            }}
          >
            <Typography textAlign="center">{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
