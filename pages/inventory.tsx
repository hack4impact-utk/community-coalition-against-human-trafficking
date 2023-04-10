import InventoryItemList from 'components/InventoryItemList'
import { CategoryResponse, InventoryItemResponse } from 'utils/types'
import inventoryItemsHandler from 'pages/api/inventoryItems'
import categoriesHandler from 'pages/api/categories'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import { Typography, Unstable_Grid2 as Grid2 } from '@mui/material'
import SearchField from 'components/SearchField'
import SearchAutocomplete from 'components/SearchAutocomplete'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      inventoryItems: await apiWrapper(inventoryItemsHandler, context),
      categories: (await apiWrapper(categoriesHandler, context)).map(
        (c) => c.name
      ),
    },
  }
}
interface Props {
  inventoryItems: InventoryItemResponse[]
  categories: string[]
}

export default function InventoryPage({ inventoryItems, categories }: Props) {
  return (
    <>
      <Grid2 container my={2} sx={{ flexGrow: 1, px: 2 }} gap={2}>
        <Grid2 xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Inventory
          </Typography>
        </Grid2>
        <Grid2 xs={12} md={4}>
          <SearchField />
        </Grid2>
        <Grid2 xs={12} md={4}>
          <SearchAutocomplete
            searchKey="category"
            options={categories}
            placeholder="Category"
          />
        </Grid2>

        <Grid2 xs={12}>
          <InventoryItemList
            inventoryItems={inventoryItems}
            search={''}
            category={''}
          />
        </Grid2>
      </Grid2>
    </>
  )
}
