import attributesHandler from '@api/attributes'
import {
  Typography,
  Button,
  Unstable_Grid2 as Grid2,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import AttributeList from 'components/AttributeList'
import SearchField from 'components/SearchField'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import { AttributeResponse } from 'utils/types'
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/router'
import theme from 'utils/theme'
import AttributeForm, { AttributeFormData } from 'components/AttributeForm'
import { useEffect, useState } from 'react'

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

  // these two states allow the edit button to work
  // setSelectedAttribute and setDialogOpen are also drilled down to AttributeListItemKebab so that
  // the kebab "Edit" button is functional
  const [selectedAttribute, setSelectedAttribute] =
    useState<AttributeResponse>()
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClose = () => {
    setDialogOpen(false)
  }

  const handleSubmit = async (
    e: React.SyntheticEvent,
    attributeFormData: AttributeFormData
  ) => {
    if (!selectedAttribute) return
    await fetch(`/api/attributes/${selectedAttribute._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: selectedAttribute._id,
        name: attributeFormData.name,
        color: attributeFormData.color,
        possibleValues:
          attributeFormData.valueType === 'list'
            ? attributeFormData.listOptions
            : attributeFormData.valueType,
      }),
    })
    window.location.reload()
  }

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
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ width: '100%' }}
            >
              Create New Attribute
            </Button>
          </Grid2>
        </Grid2>
        <Grid2 xs={12} sx={{ px: isMobileView ? 0 : 2 }}>
          <AttributeList
            attributes={attributes}
            search={router.query.search as string}
            setSelectedAttribute={setSelectedAttribute}
            setDialogOpen={setDialogOpen}
          />
        </Grid2>
      </Grid2>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Create New Attribute</DialogTitle>
        <DialogContent>
          <AttributeForm
            attribute={selectedAttribute}
            onSubmit={handleSubmit}
            submitBtnText="Update Attribute"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
