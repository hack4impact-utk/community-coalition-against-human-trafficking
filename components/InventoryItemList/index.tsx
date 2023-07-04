import { useMediaQuery, useTheme } from '@mui/material'
import DesktopInventoryItemList from 'components/InventoryItemList/DesktopInventoryItemList'
import MobileInventoryItemList from 'components/InventoryItemList/MobileInventoryItemList'
import React from 'react'
import { InventoryItemResponse } from 'utils/types'
import InventoryItemProvider from './InventoryItemContext'

interface InventoryItemListProps {
  inventoryItems: InventoryItemResponse[]
  search: string
  category: string
  total: number
  loading: boolean
  refetch: () => void
}

export default function InventoryItemList({
  inventoryItems,
  search,
  category,
  total,
  loading,
  refetch,
}: InventoryItemListProps) {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <InventoryItemProvider refetch={refetch}>
      {isMobileView ? (
        <MobileInventoryItemList
          inventoryItems={inventoryItems}
          search={search}
          category={category}
          total={total}
          loading={loading}
        />
      ) : (
        <DesktopInventoryItemList
          inventoryItems={inventoryItems}
          search={search}
          category={category}
          total={total}
          loading={loading}
        />
      )}
    </InventoryItemProvider>
  )
}
