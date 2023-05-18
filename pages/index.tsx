import InventoryItemList from 'components/InventoryItemList'
import { CategoryResponse, InventoryItemResponse } from 'utils/types'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import {
  Typography,
  Unstable_Grid2 as Grid2,
  useMediaQuery,
} from '@mui/material'
import SearchField from 'components/SearchField'
import SearchAutocomplete from 'components/SearchAutocomplete'
import { NextRouter, useRouter } from 'next/router'
import theme from 'utils/theme'
import React from 'react'
import { removeURLQueryParam } from 'utils/queryParams'
import urls from 'utils/urls'
import { constructQueryString } from 'utils/constructQueryString'
import categoriesHandler from '@api/categories'
import { dashboardPaginationDefaults } from 'utils/constants'
import useBackendPaginationCache from 'utils/hooks/useBackendPaginationCache'

type Order = 'asc' | 'desc'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      categories: (await apiWrapper(categoriesHandler, context)).map(
        (c: CategoryResponse) => c.name
      ),
    },
  }
}
interface Props {
  inventoryItems: InventoryItemResponse[]
  categories: string[]
}

const fetchInventoryItems = async (router: NextRouter) => {
  const url = `${urls.api.inventoryItems.lowStock}${constructQueryString(
    router.query as { [key: string]: string },
    true
  )}`

  const response = await fetch(url, {
    method: 'GET',
  })
  const data = await response.json()
  return data.payload
}

export default function DashboardPage({ categories }: Props) {
  const router = useRouter()
  const [inventoryItems, setInventoryItems] = React.useState<
    InventoryItemResponse[]
  >([])
  const [total, setTotal] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [search, setSearch] = React.useState<string | undefined>(undefined)
  const [category, setCategory] = React.useState<string | undefined>(undefined)
  const [orderBy, setOrderBy] = React.useState<string | undefined>(undefined)
  const [order, setOrder] = React.useState<string | undefined>(undefined)

  const { updateCache, cacheFor, isCached } =
    useBackendPaginationCache<InventoryItemResponse>(
      total,
      router.query.orderBy as string,
      router.query.order as Order
    )

  React.useEffect(() => {
    const getItems = async () => {
      setLoading(true)
      const page = Number(router.query.page) || dashboardPaginationDefaults.page
      const limit =
        Number(router.query.limit) || dashboardPaginationDefaults.limit
      // use cache if nothing has changed and cache exists
      if (
        router.query.search === search &&
        router.query.category === category &&
        router.query.orderBy === orderBy &&
        router.query.order === order
      ) {
        if (isCached(page, limit)) {
          setInventoryItems(cacheFor(page, limit))
          setLoading(false)
          return
        }
      } else {
        if (router.query.search !== search) {
          removeURLQueryParam(router, 'page')
          setSearch(router.query.search as string)
        }
        if (router.query.category !== category) {
          removeURLQueryParam(router, 'page')
          setCategory(router.query.category as string | undefined)
        }
        if (router.query.orderBy !== orderBy) {
          removeURLQueryParam(router, 'page')
          setOrderBy(router.query.orderBy as string | undefined)
        }
        if (router.query.order !== order) {
          removeURLQueryParam(router, 'page')
          setOrder(router.query.order as string | undefined)
        }
      }
      // get new items
      const items = await fetchInventoryItems(router)

      // set the new items and update the cache
      setInventoryItems(items.data)
      if (total !== items.total) setTotal(items.total)
      updateCache(items.data, page, limit)
      setLoading(false)
    }
    getItems()
  }, [
    router.query.search,
    router.query.category,
    router.query.page,
    router.query.limit,
    router.query.orderBy,
    router.query.order,
  ])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <>
      <Grid2 container my={2} sx={{ flexGrow: 1 }} gap={2}>
        <Grid2 xs={12}>
          <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
            Low in stock
          </Typography>
        </Grid2>
        <Grid2 xs={12} md={5} lg={4} sx={{ px: 2 }}>
          <SearchField />
        </Grid2>
        <Grid2 xs={12} md={5} lg={4} sx={{ px: 2 }}>
          <SearchAutocomplete
            searchKey="category"
            options={categories}
            placeholder="Category"
          />
        </Grid2>

        <InventoryItemList
          inventoryItems={inventoryItems}
          search={router.query.search as string}
          category={router.query.category as string}
          total={total}
          loading={loading}
        />
      </Grid2>
    </>
  )
}
