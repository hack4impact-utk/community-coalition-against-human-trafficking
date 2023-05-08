import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import UpsertAttributeForm from 'components/UpsertAttributeForm'
import { AttributeFormData } from 'components/UpsertAttributeForm'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function CreateNewAttributePage() {
  const [attributeFormData, setAttributeFormData] = useState<AttributeFormData>(
    {} as AttributeFormData
  )

  const router = useRouter()

  const handleClose = () => {
    router.push('/settings/attributes')
  }

  const handleSubmit = async (attributeFormData: AttributeFormData) => {
    // TODO: create post request with form data
  }

  return (
    <>
      <DialogTitle>Create Attribute</DialogTitle>
      <DialogContent>
        <UpsertAttributeForm
          onChange={(attributeFormData) =>
            setAttributeFormData(attributeFormData)
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={() => handleSubmit(attributeFormData)} color="primary">
          Submit
        </Button>
      </DialogActions>
    </>
  )
}
