import { useMediaQuery, useTheme } from '@mui/material'
import dynamic from 'next/dynamic'
import { InventoryItemResponse } from 'utils/types'

interface InventoryItemListProps {
  inventoryItems: InventoryItemResponse[]
  search: string
  category: string
}

export default function InventoryItemList({
  inventoryItems,
  search,
  category,
}: InventoryItemListProps) {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const Mobile = dynamic(
    () => import('components/InventoryItemList/MobileInventoryItemList')
  )
  const Desktop = dynamic(
    () => import('components/InventoryItemList/DesktopInventoryItemList')
  )

  return (
    <>
      {isMobileView ? (
        <Mobile
          inventoryItems={inventoryItems}
          search={search}
          category={category}
        />
      ) : (
        <Desktop
          inventoryItems={inventoryItems}
          search={search}
          category={category}
        />
      )}
    </>
  )
}
