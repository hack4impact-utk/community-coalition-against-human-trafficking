import InventoryItemList from 'components/InventoryItemList'
import { CategoryResponse, InventoryItemResponse } from 'utils/types'
import categoriesHandler from 'pages/api/categories'
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

const constructQueryString = (params: { [key: string]: string }) => {
  if (Object.keys(params).length === 0) return ''
  return `?${Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`
}

const fetchInventoryItems = async (router: NextRouter) => {
  const response = await fetch(
    `/api/inventoryItems${constructQueryString(
      router.query as { [key: string]: string }
    )}`,
    {
      method: 'GET',
    }
  )
  const data = await response.json()

  return data.payload
}

export default function InventoryPage({ categories }: Props) {
  const router = useRouter()
  const [inventoryItems, setInventoryItems] = React.useState<
    InventoryItemResponse[]
  >([])
  const [total, setTotal] = React.useState<number>(0)

  React.useEffect(() => {
    fetchInventoryItems(router).then((items) => {
      setInventoryItems(items.data)
      setTotal(items.total)
    })
  }, [
    router.query.search,
    router.query.category,
    router.query.page,
    router.query.limit,
    router.query.sort,
    router.query.order,
  ])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <>
      <Grid2 container my={2} sx={{ flexGrow: 1 }} gap={2}>
        <Grid2 xs={12}>
          <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
            Inventory
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

        <Grid2 xs={12}>
          <InventoryItemList
            inventoryItems={inventoryItems}
            search={router.query.search as string}
            category={router.query.category as string}
            total={total}
          />
        </Grid2>
      </Grid2>
    </>
  )
}
