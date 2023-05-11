import { LoadingButton } from '@mui/lab'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import UpsertAttributeForm, {
  AttributeFormData,
} from 'components/UpsertAttributeForm'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { showSnackbar } from 'store/snackbar'
import { AttributeResponse } from 'utils/types'

export default function AttributeEditDialog() {
  // you have to do this to otherwise the AttributeForm says that
  // attribute is being used before its given a value
  const [attribute, setAttribute] = useState<AttributeResponse>()
  const [attributeFormData, setAttributeFormData] = useState<AttributeFormData>(
    {} as AttributeFormData
  )

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  // get id from URL and get attributes
  const { id } = router.query
  useEffect(() => {
    const fetchAttribute = async () => {
      if (!id) return // on page load, id is undefined, resulting in bad requests
      const response = await fetch(`/api/attributes/${id}`, { method: 'GET' })
      const data = await response.json()
      setAttribute(data.payload)
    }
    fetchAttribute()
  }, [id])

  const handleSubmit = async (attributeFormData: AttributeFormData) => {
    // form validation
    if (!attributeFormData.name) {
      dispatch(
        showSnackbar({
          message: 'You must give the attribute a name.',
          severity: 'error',
        })
      )
      return
    }

    // update attribute
    const response = await fetch(`/api/attributes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: id,
        name: attributeFormData.name,
        color: attributeFormData.color,
        possibleValues:
          attributeFormData.valueType === 'list'
            ? attributeFormData.listOptions
            : attributeFormData.valueType,
      }),
    })

    // close dialog
    await router.push('/settings/attributes')

    // handle snackbar logic
    const data = await response.json()
    if (data.success) {
      dispatch(
        showSnackbar({
          message: 'Attribute successfully edited',
          severity: 'success',
        })
      )
    } else {
      dispatch(
        showSnackbar({
          message: data.message,
          severity: 'error',
        })
      )
    }
  }

  const handleClose = () => {
    router.push('/settings/attributes')
  }

  return (
    <>
      <DialogTitle>Edit Attribute</DialogTitle>
      <DialogContent sx={{ overflowY: 'visible' }}>
        <UpsertAttributeForm
          attribute={attribute}
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
