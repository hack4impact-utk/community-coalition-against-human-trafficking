import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { useAppDispatch } from 'store'
import { showSnackbar } from 'store/snackbar'
import { dialogPush } from 'utils/dialogLink'
import theme from 'utils/theme'
import { ItemDefinitionResponse } from 'utils/types'
import urls from 'utils/urls'
import {
  ItemDefinitionContext,
  ItemDefinitionContextType,
} from '../ItemDefintionContext'

interface Props {
  itemDefinition: ItemDefinitionResponse
}

export default function ItemDefinitionListItemKebab({ itemDefinition }: Props) {
  const router = useRouter()
  const { deleteItemDefinition } = React.useContext(
    ItemDefinitionContext
  ) as ItemDefinitionContextType
  const dispatch = useAppDispatch()
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
        dialogPush(
          router,
          urls.pages.dialogs.editItemDefinition(itemDefinition._id)
        )
      },
    },
    {
      name: 'Delete',
      onClick: async () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
          await fetch(
            urls.api.itemDefinitions.itemDefinition(itemDefinition._id),
            {
              method: 'DELETE',
            }
          )
          deleteItemDefinition(itemDefinition._id)
          dispatch(
            showSnackbar({
              message: 'Item deleted successfully.',
              severity: 'success',
            })
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
