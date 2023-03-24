import {
  Chip,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  Avatar,
} from '@mui/material'
import { Attribute, InventoryItem, ItemDefinition, User } from 'utils/types'
import React from 'react'
import theme from 'utils/theme'
import InventoryItemListItemKebab from 'components/InventoryItemListItemKebab'
import { Warning } from '@mui/icons-material'

interface MobileInventoryItemListItemProps {
  inventoryItem: ExpandedInventoryItem
}

// TODO: use updated type from andrews pr when ready
interface ExpandedInventoryItem extends InventoryItem {
  itemDefinition: ItemDefinition
  attributes: {
    attribute: Attribute
    value: string | number
  }[]
  assignee?: User
}

function textColor(inventoryItem: InventoryItem) {
  const itemDef = inventoryItem.itemDefinition as ItemDefinition
  console.log(itemDef, inventoryItem.quantity)
  if (inventoryItem.quantity < itemDef.lowStockThreshold) {
    if (inventoryItem.quantity < itemDef.criticalStockThreshold) {
      return theme.palette.error.main
    }
    return theme.palette.warning.main
  }
  return 'text.secondary'
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
            color="text.primary"
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
              <Warning
                fontSize="small"
                sx={{
                  ml: 1,
                  top: 4,
                  position: 'relative',
                  color: textColor(inventoryItem),
                }}
              />
            )}

            <br />
            {inventoryItem.attributes.map((attribute) => (
              <Chip
                label={`${attribute.attribute.name}: ${attribute.value}`}
                sx={{
                  backgroundColor: attribute.attribute.color,
                  mr: 1,
                  mt: 1,
                }}
                key={`${attribute.attribute.name}-${attribute.value}`}
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
