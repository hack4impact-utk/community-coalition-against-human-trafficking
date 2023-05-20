import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { useAppDispatch } from 'store'
import { showSnackbar } from 'store/snackbar'
import { dialogPush } from 'utils/dialogLink'
import theme from 'utils/theme'
import { AttributeResponse } from 'utils/types'
import urls from 'utils/urls'
import { AttributeContext, AttributeContextType } from '../AttributeContext'

interface AttributeListItemKebabOption {
  name: string
  onClick: () => void
}

interface AttributeListItemKebabProps {
  attribute: AttributeResponse
}

export default function AttributeListItemKebab({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attribute,
}: AttributeListItemKebabProps) {
  const { deleteAttribute } = React.useContext(
    AttributeContext
  ) as AttributeContextType
  const router = useRouter()
  const dispatch = useAppDispatch()
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
  const settings: AttributeListItemKebabOption[] = [
    {
      name: 'Edit',
      onClick: () => {
        dialogPush(router, urls.pages.dialogs.editAttribute(attribute._id))
      },
    },
    {
      name: 'Delete',
      onClick: async () => {
        if (window.confirm('Are you sure you want to delete this attribute?')) {
          await fetch(urls.api.attributes.attribute(attribute._id), {
            method: 'DELETE',
          })
          deleteAttribute(attribute._id)
          dispatch(
            showSnackbar({
              message: 'Attribute deleted successfully.',
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
