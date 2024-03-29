import { Box, List } from '@mui/material'
import React from 'react'
import { InventoryItemResponse } from 'utils/types'
import MobileInventoryItemListItem from 'components/InventoryItemList/MobileInventoryItemList/MobileInventoryItemListItem'
import InfiniteScroll from 'components/InfiniteScroll'
import { inventoryPaginationDefaults } from 'utils/constants'
import { useRouter } from 'next/router'
import urls from 'utils/urls'
import { constructQueryString } from 'utils/constructQueryString'
import NoResultsText from 'components/NoResultsText'

interface MobileInventoryItemListProps {
  inventoryItems: InventoryItemResponse[]
  search: string
  category: string
  total: number
  loading: boolean
}

export default function MobileInventoryItemList({
  inventoryItems,
  total,
  loading: initLoading,
}: MobileInventoryItemListProps) {
  const [visibleRows, setVisibleRows] =
    React.useState<InventoryItemResponse[]>(inventoryItems)
  const [page, setPage] = React.useState<number>(0)
  const [loading, setLoading] = React.useState(true)
  const { limit } = inventoryPaginationDefaults
  const router = useRouter()

  const nextFn = React.useCallback(async () => {
    const newPage = page + 1
    setPage((prev) => {
      return prev + 1
    })
    const response = await fetch(
      `${
        urls.api.inventoryItems.inventoryItems
      }?page=${newPage}${constructQueryString(
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
    setPage(0)
  }, [router.query])

  React.useEffect(() => {
    setVisibleRows(inventoryItems)
  }, [inventoryItems])

  return (
    <InfiniteScroll
      next={nextFn}
      hasMore={Number(page) * limit + limit < total}
      setParentLoading={setLoading}
    >
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {visibleRows.length ? (
          visibleRows.map((inventoryItem) => (
            <MobileInventoryItemListItem
              inventoryItem={inventoryItem}
              key={inventoryItem._id}
            />
          ))
        ) : (
          <>
            {!loading && !initLoading && (
              <Box>
                <NoResultsText />
              </Box>
            )}
          </>
        )}
      </List>
    </InfiniteScroll>
  )
}
