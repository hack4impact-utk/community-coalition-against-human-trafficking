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
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/router'
import theme from 'utils/theme'
import RoutableDialog from 'components/RoutableDialog'
import React from 'react'
import DialogLink from 'components/DialogLink'
import dynamic from 'next/dynamic'

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
  const NewAttributeDialog = dynamic(
    () => import('pages/settings/attributes/create')
  )
  const EditAttributeDialog = dynamic(
    () => import('pages/settings/attributes/[attributeId]/edit')
  )
  return (
    <>
      <Grid2 container my={2} sx={{ flexGrow: 1 }} gap={2}>
        <Grid2 xs={12}>
          <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
            Attributes
          </Typography>
        </Grid2>
        <Grid2
          container
          xs={12}
          direction={isMobileView ? 'column-reverse' : 'row'}
          gap={isMobileView ? 2 : 0}
          sx={{ px: 2 }}
        >
          <Grid2 xs={12} md={4}>
            <SearchField />
          </Grid2>
          <Grid2 ml={isMobileView ? '' : 'auto'}>
            <DialogLink href="/settings/attributes/create">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ width: '100%' }}
              >
                Create New Attribute
              </Button>
            </DialogLink>
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
        <EditAttributeDialog />
      </RoutableDialog>
      <RoutableDialog name="createAttribute">
        <NewAttributeDialog />
      </RoutableDialog>
    </>
  )
}
