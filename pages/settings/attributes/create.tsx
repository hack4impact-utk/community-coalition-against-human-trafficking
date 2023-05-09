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
import { LoadingButton } from '@mui/lab'

export default function AttributeCreateForm() {
  const [loading, setLoading] = useState(false)
  const [attributeFormData, setAttributeFormData] = useState<AttributeFormData>(
    {} as AttributeFormData
  )

  const router = useRouter()

  const handleClose = () => {
    router.push('/settings/attributes')
  }

  const handleSubmit = async (attributeFormData: AttributeFormData) => {
    // form validation
    if (!attributeFormData.name) return

    await fetch('/api/attributes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: attributeFormData.name,
        color: attributeFormData.color,
        possibleValues:
          attributeFormData.valueType === 'list'
            ? attributeFormData.listOptions
            : attributeFormData.valueType,
      }),
    })
    
    await router.push('/settings/attributes')
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
        <LoadingButton
          loading={loading}
          onClick={async () => {
            setLoading(true)
            await handleSubmit(attributeFormData)
            setLoading(false)
          }}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </>
  )
}
