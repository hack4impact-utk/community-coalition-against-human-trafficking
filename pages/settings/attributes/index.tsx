import attributesHandler from '@api/attributes'
import {
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
import { useRouter } from 'next/router'
import theme from 'utils/theme'
import RoutableDialog from 'components/RoutableDialog'
import AttributeEditForm from 'pages/settings/attributes/[attributeId]/edit'
import React from 'react'
import DialogLink from 'components/DialogLink'
import AttributeCreateForm from 'pages/settings/attributes/create'
import urls from 'utils/urls'

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
    <>
      <Grid2 container my={2} sx={{ flexGrow: 1 }} gap={2}>
        <Grid2 xs={12} container direction={'row'}>
          <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
            Attributes
          </Typography>
          <Grid2 ml="auto" mr={isMobileView ? 2 : 6}>
            <DialogLink href={urls.pages.dialogs.createAttribute}>
              <Button variant="outlined" sx={{ width: '100%' }}>
                Create New Attribute
              </Button>
            </DialogLink>
          </Grid2>
        </Grid2>
        <Grid2
          container
          xs={12}
          gap={isMobileView ? 2 : 0}
          sx={{ px: 2, xs: 12, md: 4 }}
        >
          <Grid2 xs={12} md={4}>
            <SearchField />
          </Grid2>
        </Grid2>
        <Grid2 xs={12} sx={{ px: isMobileView ? 0 : 2 }}>
          <AttributeList
            attributes={attributes}
            search={router.query.search as string}
          />
        </Grid2>
      </Grid2>

      {/* These RoutableDialogs provide functionality to buttons that open dialogs */}
      <RoutableDialog name="editAttribute">
        <AttributeEditForm />
      </RoutableDialog>
      <RoutableDialog name="createAttribute">
        <AttributeCreateForm />
      </RoutableDialog>
    </>
  )
}
