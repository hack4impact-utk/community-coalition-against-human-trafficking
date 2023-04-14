import attributesHandler from '@api/attributes'
import {
  Box,
  Typography,
  Button,
  Unstable_Grid2 as Grid2,
  useMediaQuery,
} from '@mui/material'
import AttributeList from 'components/AttributeList'
import SearchField from 'components/SearchField'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import { AttributeResponse } from 'utils/types'
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/router'
import theme from 'utils/theme'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { attributes: await apiWrapper(attributesHandler, context) },
  }
}

interface AttributesPageProps {
  attributes: AttributeResponse[]
}

export default function AttributesPage({ attributes }: AttributesPageProps) {
  const router = useRouter()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Grid2 container my={2} sx={{ flexGrow: 1 }} gap={2}>
      <Grid2 xs={12}>
        <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
          Attributes
        </Typography>
      </Grid2>
      <Grid2 container xs={12} sx={{ px: 2 }}>
        <Grid2 xs={12} md={4}>
          <SearchField />
        </Grid2>
        <Grid2 xs="auto" ml={isMobileView ? '' : 'auto'}>
          <Button variant="outlined" startIcon={<AddIcon />}>
            Create New Attribute
          </Button>
        </Grid2>
      </Grid2>
      <Grid2 xs={12} sx={{ px: isMobileView ? 0 : 2 }}>
        <AttributeList
          attributes={attributes}
          search={router.query.search as string}
        />
      </Grid2>
    </Grid2>
  )
}
