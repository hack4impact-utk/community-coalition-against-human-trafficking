import { List } from '@mui/material'
import React from 'react'
import { InventoryItemResponse } from 'utils/types'
import MobileInventoryItemListItem from './MobileInventoryItemListItem'

interface MobileInventoryItemListProps {
  inventoryItems: InventoryItemResponse[]
  search: string
  category: string
}
export default function MobileInventoryItemList({
  inventoryItems,
  search,
  category,
}: MobileInventoryItemListProps) {
  const [filteredData, setFilteredData] = React.useState(inventoryItems)

  React.useEffect(() => {
    let newTableData = inventoryItems
    if (search) {
      const lowerSearch = search.toLowerCase()
      newTableData = [
        ...newTableData.filter((item) => {
          return (
            item.itemDefinition.name.toLowerCase().includes(lowerSearch) ||
            (item.attributes &&
              (item.attributes
                .map((attr) => String(attr.value).toLowerCase())
                .join(' ')
                .includes(lowerSearch) ||
                item.attributes
                  .map((attr) => attr.attribute.name.toLowerCase())
                  .join(' ')
                  .includes(lowerSearch))) ||
            (item.itemDefinition.category &&
              item.itemDefinition.category.name
                .toLowerCase()
                .includes(lowerSearch)) ||
            (item.assignee &&
              item.assignee.name.toLowerCase().includes(lowerSearch))
          )
        }),
      ]
    }

    if (category) {
      newTableData = [
        ...newTableData.filter((item) => {
          return item.itemDefinition.category?.name === category
        }),
      ]
    }

    setFilteredData(newTableData)
  }, [inventoryItems, search, category])
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {filteredData.map((inventoryItem) => (
        <MobileInventoryItemListItem
          inventoryItem={inventoryItem}
          key={inventoryItem._id}
        />
      ))}
    </List>
  )
}
