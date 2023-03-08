import {
  Chip,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material'
import { Attribute, InventoryItem, ItemDefinition, User } from 'utils/types'
import React from 'react'

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
  assignee: User
}

export default function MobileInventoryItemListItem({
  inventoryItem,
}: MobileInventoryItemListItemProps) {
  return (
    <ListItem alignItems="flex-start" divider>
      <ListItemText
        primary={
          <Typography
            sx={{ fontWeight: 'bold', display: 'block' }}
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
            {inventoryItem.itemDefinition.category.name}
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
      <ListItemSecondaryAction>
        <Typography
          sx={{ fontWeight: 'bold', display: 'block' }}
          component="span"
          variant="subtitle1"
          color="text.primary"
        >
          {inventoryItem.quantity}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
