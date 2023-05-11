import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import router from 'next/router'
import React from 'react'
import { dialogPush } from 'utils/dialogLink'
import theme from 'utils/theme'
import { CategoryResponse } from 'utils/types'

interface CategoryListItemKebabOption {
  name: string
  onClick: () => void
}

interface CategoryListItemKebabProps {
  category: CategoryResponse
}

export default function AttributeListItemKebab({
  category,
}: CategoryListItemKebabProps) {
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
  // kebab menu actions
  const settings: CategoryListItemKebabOption[] = [
    {
      name: 'Edit',
      onClick: () => {
        dialogPush(router, `/settings/categories/${category._id}/edit`)
      },
    },
    {
      name: 'Delete',
      onClick: () => {
        if (window.confirm('Are you sure you want to delete this category?')) {
          fetch(`/api/categories/${category._id}`, { method: 'DELETE' }).then(
            () => window.location.reload()
          )
        }
      },
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
