import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import router from 'next/router'
import React from 'react'
import { dialogPush } from 'utils/dialogLink'
import theme from 'utils/theme'
import { CategoryResponse } from 'utils/types'
import urls from 'utils/urls'

interface CategoryListItemKebabOption {
  name: string
  onClick: () => void
}

interface CategoryListItemKebabProps {
  category: CategoryResponse
}

export default function CategoryListItemKebab({
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
        dialogPush(router, urls.pages.dialogs.editCategory(category._id))
      },
    },
    {
      name: 'Delete',
      onClick: async () => {
        if (window.confirm('Are you sure you want to delete this category?')) {
          await fetch(urls.api.categories.category(category._id), {
            method: 'DELETE',
          })
          window.location.reload()
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
