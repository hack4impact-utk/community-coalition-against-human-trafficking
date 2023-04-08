import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import theme from 'utils/theme'
import { InventoryItem } from 'utils/types'
import { useRouter } from 'next/router'
import * as MongoDriver from 'server/actions/MongoDriver'
import InventoryItemSchema from 'server/models/InventoryItem'

interface InventoryItemListItemKebabOption {
  name: string
  onClick: () => void
}

interface InventoryItemListItemKebabProps {
  inventoryItem: InventoryItem
}

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
  const router = useRouter()
  const option: InventoryItemListItemKebabOption[] = [
    {
      name: 'Check in',
      onClick: () => router.push(`/checkIn?inventoryItem=${inventoryItem}`),
    },
    {
      name: 'Check out',
      onClick: () => router.push(`/checkOut?inventoryItem=${inventoryItem}`),
    },
    {
      name: 'Delete',
      onClick: () =>
        MongoDriver.deleteEntity(
          InventoryItemSchema,
          String(inventoryItem._id)
        ),
    },
  ]
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
        {option.map((option) => (
          <MenuItem
            key={option.name}
            onClick={() => {
              option.onClick()
              handleCloseKebabMenu()
            }}
          >
            <Typography textAlign="center">{option.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
