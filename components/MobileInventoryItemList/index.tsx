import { List } from '@mui/material'
import { InventoryItem, ItemDefinition, Attribute, User } from 'utils/types'
import MobileInventoryItemListItem from './MobileInventoryItemListItem'

// TODO: use updated type from andrews pr when ready
interface ExpandedInventoryItem extends InventoryItem {
  itemDefinition: ItemDefinition
  attributes: {
    attribute: Attribute
    value: string | number
  }[]
  assignee?: User
}

interface MobileInventoryItemListProps {
  inventoryItems: ExpandedInventoryItem[]
}
export default function MobileInventoryItemList({
  inventoryItems,
}: MobileInventoryItemListProps) {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {inventoryItems.map((inventoryItem) => (
        <MobileInventoryItemListItem
          inventoryItem={inventoryItem}
          key={inventoryItem._id}
        />
      ))}
    </List>
  )
}
