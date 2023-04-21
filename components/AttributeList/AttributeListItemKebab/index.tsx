import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import DialogLink from 'components/DialogLink'
import { useRouter } from 'next/router'
import React from 'react'
import theme from 'utils/theme'
import { AttributeResponse } from 'utils/types'

interface AttributeListItemKebabOption {
  name: string
  onClick: () => void
}

interface AttributeListItemKebabProps {
  attribute: AttributeResponse
}

export default function AttributeListItemKebab({
  attribute,
}: AttributeListItemKebabProps) {
  const router = useRouter()
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
      onClick: () => console.log('edit button pressed'),
    },
    {
      name: 'Delete',
      onClick: () => {
        if (window.confirm('Are you sure you want to delete this attribute?')) {
          fetch(`/api/attributes/${attribute._id}`, { method: 'DELETE' }).then(
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
        {settings.map((setting) =>
          setting.name === 'edit' ? (
            <DialogLink href={`/settings/attributes/${attribute._id}/edit`}>
              <MenuItem
                key={setting.name}
                onClick={() => {
                  setting.onClick()
                  handleCloseKebabMenu()
                }}
              >
                <Typography textAlign="center">{setting.name}</Typography>
              </MenuItem>
            </DialogLink>
          ) : (
            <MenuItem
              key={setting.name}
              onClick={() => {
                setting.onClick()
                handleCloseKebabMenu()
              }}
            >
              <Typography textAlign="center">{setting.name}</Typography>
            </MenuItem>
          )
        )}
      </Menu>
    </>
  )
}
