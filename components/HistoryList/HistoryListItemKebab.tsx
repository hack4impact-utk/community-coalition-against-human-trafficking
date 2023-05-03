import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import theme from 'utils/theme'
import { AttributeResponse, LogResponse } from 'utils/types'

interface HistoryListItemKebabOption {
  name: string
  onClick: () => void
}

interface HistoryListItemKebabProps {
  log: LogResponse
}

export default function AttributeListItemKebab({
  log,
}: HistoryListItemKebabProps) {
  // kebab menu functionality

  const kebabOptions: HistoryListItemKebabOption[] = [
    {
      name: 'Delete',
      onClick: () => {
        if (
          window.confirm(
            "Are you sure you want to delete this log entry? You won't be able to undo this action."
          )
        ) {
          fetch(`/api/logs/${log._id}`, {
            method: 'DELETE',
          }).then(() => {
            window.location.reload()
          })
        }
      },
    },
  ]

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
        {kebabOptions.map((setting) => (
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
