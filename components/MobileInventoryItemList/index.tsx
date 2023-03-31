import { List } from '@mui/material'
import { InventoryItemResponse } from 'utils/types'
import MobileInventoryItemListItem from './MobileInventoryItemListItem'

interface MobileInventoryItemListProps {
  inventoryItems: InventoryItemResponse[]
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
