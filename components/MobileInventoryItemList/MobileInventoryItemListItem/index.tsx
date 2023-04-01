import {
  Chip,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  Avatar,
} from '@mui/material'
import { InventoryItemResponse } from 'utils/types'
import React from 'react'
import theme from 'utils/theme'
import InventoryItemListItemKebab from 'components/InventoryItemListItemKebab'
import WarningIcon from '@mui/icons-material/Warning'
import getContrastYIQ from 'utils/getContrastYIQ'

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
            {inventoryItem.attributes?.map((itemAttribute) => (
              <Chip
                label={
                  typeof itemAttribute.attribute.possibleValues === 'object'
                    ? `${itemAttribute.value}`
                    : `${itemAttribute.attribute.name}: ${itemAttribute.value}`
                }
                sx={{
                  backgroundColor: itemAttribute.attribute.color,
                  '& .MuiChip-label': {
                    color: getContrastYIQ(itemAttribute.attribute.color),
                  },
                  mr: 1,
                  mt: 1,
                }}
                key={`${itemAttribute.attribute.name}-${itemAttribute.value}`}
                size="small"
              />
            ))}
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
