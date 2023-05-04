import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import theme from 'utils/theme'
import { useRouter } from 'next/router'
import { dialogPush } from 'utils/dialogLink'
import { ItemDefinitionResponse } from 'utils/types'
import DialogLink from 'components/DialogLink'

interface Props {
  itemDefinition: ItemDefinitionResponse
}

export default function ItemDefinitionListItemKebab({ itemDefinition }: Props) {
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
      onClick: () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
          fetch(`/api/itemDefinitions/${itemDefinition._id}`, {
            method: 'DELETE',
          }).then(() => window.location.reload())
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
        {options.map((option) =>
          option.name === 'edit' ? (
            <DialogLink href={`/settings/items/${itemDefinition._id}/edit`}>
              <MenuItem
                key={option.name}
                onClick={() => {
                  option.onClick()
                  console.log(
                    dialogPush(
                      router,
                      `/settings/items/${itemDefinition._id}/edit`
                    )
                  )
                  handleCloseKebabMenu()
                }}
              >
                <Typography textAlign="center">{option.name}</Typography>
              </MenuItem>
            </DialogLink>
          ) : (
            <MenuItem
              key={option.name}
              onClick={() => {
                option.onClick()
                handleCloseKebabMenu()
              }}
            >
              <Typography textAlign="center">{option.name}</Typography>
            </MenuItem>
          )
        )}
      </Menu>
    </>
  )
}
