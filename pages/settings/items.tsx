import { Button, Typography, Unstable_Grid2 as Grid2 } from '@mui/material'
import SearchField from 'components/SearchField'
import AddIcon from '@mui/icons-material/Add'
import ItemDefinitionList from 'components/ItemDefinitionList'
import { ItemDefinitionResponse } from 'utils/types'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import itemDefinitionsHandler from '@api/itemDefinitions'
import { useRouter } from 'next/router'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      itemDefinitions: await apiWrapper(itemDefinitionsHandler, context)
    }
  }
}

interface Props {
  itemDefinitions: ItemDefinitionResponse[]
}

export default function ItemsPage({ itemDefinitions }: Props) {
  const router = useRouter()

  return (
    <Grid2 container my={2} sx={{ flexGrow: 1, px: 2 }} gap={2}>
      <Grid2 xs={12} container direction={'row'}>
        <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
          Items
        </Typography>
        <Grid2 ml="auto" mr={6}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ width: '100%' }}
          >
            Create New Item
          </Button>
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
  )
}
