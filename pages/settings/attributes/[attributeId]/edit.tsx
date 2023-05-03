import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import AttributeForm, {
  AttributeFormData,
} from 'components/UpsertAttributeForm'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react'
import { AttributeResponse } from 'utils/types'

export default function AttributeEditForm() {
  // you have to do this to otherwise the AttributeForm says that
  // attribute is being used before its given a value
  const [attribute, setAttribute] = useState<AttributeResponse>()
  const [attributeFormData, setAttributeFormData] = useState<AttributeFormData>(
    {} as AttributeFormData
  )
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    const fetchAttribute = async () => {
      if (!id) return // on page load, id is undefined, resulting in bad requests
      fetch(`/api/attributes/${id}`, { method: 'GET' }).then((response) => {
        response.json().then((data) => {
          setAttribute(data.payload)
        })
      })
    }
    fetchAttribute()
  }, [id])

  const handleSubmit = async (attributeFormData: AttributeFormData) => {
    await fetch(`/api/attributes/${id}`, {
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
    await router.push('/settings/attributes')
    router.reload()
  }

  const handleClose = () => {
    router.push('/settings/attributes')
  }

  return (
    <>
      <DialogTitle>Create New Attribute</DialogTitle>
      <DialogContent>
        <AttributeForm
          attribute={attribute}
          onChange={(attributeFormData) =>
            setAttributeFormData(attributeFormData)
          }
        >
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit(attributeFormData)}
              color="primary"
            >
              Submit
            </Button>
          </DialogActions>
        </AttributeForm>
      </DialogContent>
    </>
  )
}