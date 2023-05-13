import { List } from '@mui/material'
import React from 'react'
import { InventoryItemResponse } from 'utils/types'
import MobileInventoryItemListItem from 'components/InventoryItemList/MobileInventoryItemList/MobileInventoryItemListItem'
import InfiniteScroll from 'components/InfiniteScroll'
import { inventoryPaginationDefaults } from 'utils/constants'
import { useRouter } from 'next/router'

interface MobileInventoryItemListProps {
  inventoryItems: InventoryItemResponse[]
  search: string
  category: string
  total: number
}

const constructQueryString = (params: { [key: string]: string }) => {
  if (Object.keys(params).length === 0) return ''
  return `&${Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`
}

export default function MobileInventoryItemList({
  inventoryItems,
  total,
}: MobileInventoryItemListProps) {
  const [visibleRows, setVisibleRows] =
    React.useState<InventoryItemResponse[]>(inventoryItems)
  const [page, setPage] = React.useState<number>(0)
  const { limit } = inventoryPaginationDefaults
  const router = useRouter()

  const nextFn = React.useCallback(async () => {
    const newPage = page + 1
    setPage((prev) => {
      return prev + 1
    })
    const response = await fetch(
      `/api/inventoryItems?page=${newPage}${constructQueryString(
        router.query as { [key: string]: string }
      )}`
    )
    const { payload } = await response.json()

    setVisibleRows((prev) => {
      const t = [...prev, ...payload.data]
      return t
    })
  }, [page, setVisibleRows, setPage, router.query])

  React.useEffect(() => {
    setPage(1)
  }, [router.query])

  React.useEffect(() => {
    setVisibleRows(inventoryItems)
  }, [inventoryItems])
  return (
    <InfiniteScroll
      next={nextFn}
      hasMore={Number(page) * limit + limit < total}
    >
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {visibleRows.map((inventoryItem) => (
          <MobileInventoryItemListItem
            inventoryItem={inventoryItem}
            key={inventoryItem._id}
          />
        ))}
      </List>
    </InfiniteScroll>
  )
}
