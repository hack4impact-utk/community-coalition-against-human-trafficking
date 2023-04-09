import { useMediaQuery, useTheme } from '@mui/material'
import DesktopInventoryItemList from 'components/DesktopInventoryItemList'
import MobileInventoryItemList from 'components/MobileInventoryItemList'
import { InventoryItemResponse } from 'utils/types'

interface InventoryItemListProps {
  inventoryItems: InventoryItemResponse[]
  search: string
  category: string
}

export default function InventoryItemList( {inventoryItems, search, category}: InventoryItemListProps) {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <>
      {isMobileView ? (
        <MobileInventoryItemList inventoryItems={inventoryItems}/>
      ) : (
        <DesktopInventoryItemList inventoryItems={inventoryItems} search={search} category={category}/>
      )}
    </>
  )
}
