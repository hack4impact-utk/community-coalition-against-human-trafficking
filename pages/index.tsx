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

  React.useEffect(() => {
    const getItems = async () => {
      setLoading(true)
      const items = await fetchInventoryItems(router)
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
      setInventoryItems(items.data)
      if (total !== items.total) setTotal(items.total)
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
