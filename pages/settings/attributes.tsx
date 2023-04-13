import attributesHandler from '@api/attributes'
import { Box, Typography, Button } from '@mui/material'
import AttributeList from 'components/AttributeList'
import SearchField from 'components/SearchField'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import { AttributeResponse } from 'utils/types'
import AddIcon from '@mui/icons-material/Add';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { attributes: await apiWrapper(attributesHandler, context) },
  }
}

interface AttributesPageProps {
  attributes: AttributeResponse[]
}

export default function AttributesPage({ attributes }: AttributesPageProps) {
  return (
    <Box display="flex" flexDirection="column" mt={2}>
      <Box display="flex">
        <Typography variant="h5" sx={{ ml: 2 }}>
          Attributes
        </Typography>
        <Button variant="outlined" startIcon={<AddIcon />} sx={{ ml: 'auto', mr: 2 }}>
          Create New Attribute
        </Button>
      </Box>
      <Box width="33%" ml={2}>
        <SearchField />
      </Box>
      <AttributeList attributes={attributes} search={''} />
    </Box>
  )
}
