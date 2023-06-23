import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import theme from 'utils/theme'
import { InventoryItemResponse } from 'utils/types'
import { useRouter } from 'next/router'
import { showSnackbar } from 'store/snackbar'
import { useAppDispatch } from 'store'
import urls from 'utils/urls'
import { dialogPush } from 'utils/dialogLink'

interface InventoryItemListItemKebabOption {
  name: string
  onClick: () => void
}

interface InventoryItemListItemKebabProps {
  inventoryItem: InventoryItemResponse
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
  const dispatch = useAppDispatch()

  const options: InventoryItemListItemKebabOption[] = React.useMemo(() => {
    const options = []

    // if the item is internal and not assigned, add assign option
    // if the item is internal and assigned, add reassign option
    // otherwise, add check in/out options
    if (inventoryItem.itemDefinition.internal) {
      options.push({
        name: inventoryItem.assignee ? 'Reassign' : 'Assign',
        onClick: () =>
          dialogPush(
            router,
            urls.pages.dialogs.assignInventoryItem(inventoryItem._id)
          ),
      })
    } else {
      options.push({
        name: 'Check in',
        onClick: () =>
          router.push(
            urls.pages.checkInItem(
              encodeURIComponent(JSON.stringify(inventoryItem))
            )
          ),
      })
      options.push({
        name: 'Check out',
        onClick: () =>
          router.push(
            urls.pages.checkOutItem(
              encodeURIComponent(JSON.stringify(inventoryItem))
            )
          ),
      })
    }

    options.push({
      name: 'Delete',
      onClick: () => {
        if (
          window.confirm(
            'Are you sure you want to delete this from the inventory?'
          )
        ) {
          fetch(urls.api.inventoryItems.inventoryItem(inventoryItem._id), {
            method: 'DELETE',
          }).then(() => {
            window.location.reload()
            // @ts-ignore
            dispatch(
              showSnackbar({
                message: 'Item successfully deleted.',
                severity: 'success',
              })
            )
          })
        }
      },
    })

    return options
  }, [router, inventoryItem, dispatch])

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
