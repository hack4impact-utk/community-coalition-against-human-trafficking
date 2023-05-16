import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { dialogPush } from 'utils/dialogLink'
import theme from 'utils/theme'
import { ItemDefinitionResponse } from 'utils/types'

interface Props {
  itemDefinition: ItemDefinitionResponse
}

export default function ItemDefinitionListItemKebab({ itemDefinition }: Props) {
  const router = useRouter()
  const [anchorElKebab, setAnchorElKebab] = React.useState<null | HTMLElement>(
    null
  )

  const handleOpenKebabMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElKebab(event.currentTarget)
  }

  const handleCloseKebabMenu = () => {
    setAnchorElKebab(null)
  }

  interface ItemDefinitionListItemKebabOption {
    name: string
    onClick: () => void
  }

  const options: ItemDefinitionListItemKebabOption[] = [
    {
      name: 'Edit',
      onClick: () => {
        dialogPush(router, `/settings/items/${itemDefinition._id}/edit`)
      },
    },
    {
      name: 'Delete',
      onClick: async () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
          await fetch(`/api/itemDefinitions/${itemDefinition._id}`, {
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
        {options.map((option) => (
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
