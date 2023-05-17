import {
  Button,
  Typography,
  Unstable_Grid2 as Grid2,
  useMediaQuery,
} from '@mui/material'
import SearchField from 'components/SearchField'
import ItemDefinitionList from 'components/ItemDefinitionList'
import { ItemDefinitionResponse } from 'utils/types'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import itemDefinitionsHandler from '@api/itemDefinitions'
import { useRouter } from 'next/router'
import DialogLink from 'components/DialogLink'
import theme from 'utils/theme'
import RoutableDialog from 'components/RoutableDialog'
import NewItemPage from 'pages/items/new'
import ItemDefinitionEditForm from './[itemDefinitionId]/edit'
import urls from 'utils/urls'
import { bulkRemoveURLQueryParams } from 'utils/queryParams'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      itemDefinitions: await apiWrapper(itemDefinitionsHandler, context),
    },
  }
}

interface Props {
  itemDefinitions: ItemDefinitionResponse[]
}

export default function ItemsPage({ itemDefinitions }: Props) {
  const router = useRouter()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      <Grid2 container my={2} sx={{ flexGrow: 1, px: 2 }} gap={2}>
        <Grid2 xs={12} container direction={'row'}>
          <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
            Items
          </Typography>
          <Grid2 ml="auto" mr={isMobileView ? 2 : 6}>
            <DialogLink href={urls.pages.dialogs.createItemDefinition}>
              <Button variant="outlined" sx={{ width: '100%' }}>
                Create New Item
              </Button>
            </DialogLink>
          </Grid2>
        </Grid2>
        <Grid2 xs={12} md={5} lg={4} sx={{ px: 2 }}>
          <SearchField />
        </Grid2>
        <ItemDefinitionList
          itemDefinitions={itemDefinitions}
          search={router.query.search as string}
        />
      </Grid2>
      <RoutableDialog name="createItem">
        <NewItemPage
          redirectBack={async (router) => {
            await bulkRemoveURLQueryParams(router, ['showDialog', 'id'])
          }}
        />
      </RoutableDialog>
      <RoutableDialog name="editItemDefinition">
        <ItemDefinitionEditForm />
      </RoutableDialog>
    </>
  )
}
