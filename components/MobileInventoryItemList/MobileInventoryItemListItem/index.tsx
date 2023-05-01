import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  Avatar,
  Box,
} from '@mui/material'
import { InventoryItemResponse } from 'utils/types'
import React from 'react'
import theme from 'utils/theme'
import InventoryItemListItemKebab from 'components/InventoryItemListItemKebab'
import WarningIcon from '@mui/icons-material/Warning'
import renderAttributeChips from 'utils/renderAttributeChips'

interface MobileInventoryItemListItemProps {
  inventoryItem: InventoryItemResponse
}

export default function MobileInventoryItemListItem({
  inventoryItem,
}: MobileInventoryItemListItemProps) {
  return (
    <ListItem alignItems="flex-start" divider>
      <ListItemText
        primary={
          <Typography
            sx={{
              fontWeight: 'bold',
            }}
            component="span"
            variant="body1"
          >
            {inventoryItem.itemDefinition.name}
          </Typography>
        }
        secondary={
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            sx={{ display: 'block' }}
          >
            {inventoryItem.quantity}
            {inventoryItem.quantity <
              inventoryItem.itemDefinition.lowStockThreshold && (
              <WarningIcon
                fontSize="small"
                sx={{
                  ml: 1,
                  top: 4,
                  position: 'relative',
                  color:
                    inventoryItem.quantity <
                    inventoryItem.itemDefinition.criticalStockThreshold
                      ? theme.palette.error.main
                      : theme.palette.warning.light,
                }}
              />
            )}

            <br />
            <Box ml={-1}>{renderAttributeChips(inventoryItem.attributes)}</Box>
          </Typography>
        }
      />
      <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center' }}>
        {!!inventoryItem.assignee && (
          <Avatar src={inventoryItem.assignee.image} sx={{ mr: 2 }} />
        )}
        <InventoryItemListItemKebab inventoryItem={inventoryItem} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}
