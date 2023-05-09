import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import UpsertAttributeForm from 'components/UpsertAttributeForm'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { useEffect, useState } from 'react'
import transformZodErrors from 'utils/transformZodErrors'
import {
  AttributeFormData,
  attributeFormSchema,
  AttributeResponse,
} from 'utils/types'

export default function AttributeEditForm() {
  // you have to do this to otherwise the AttributeForm says that
  // attribute is being used before its given a value
  const [attribute, setAttribute] = useState<AttributeResponse>()
  const [errors, setErrors] = useState<Record<keyof AttributeFormData, string>>(
    {} as Record<keyof AttributeFormData, string>
  )
  const [attributeFormData, setAttributeFormData] = useState<AttributeFormData>(
    {} as AttributeFormData
  )
  const router = useRouter()
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

  const handleSubmit = useCallback(
    async (attributeFormData: AttributeFormData) => {
      const zodResponse = attributeFormSchema.safeParse(attributeFormData)
      if (!zodResponse.success) {
        setErrors(transformZodErrors(zodResponse.error))
        return
      }
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
    },
    [id, router]
  )

  const handleClose = () => {
    router.push('/settings/attributes')
  }

  return (
    <>
      <DialogTitle>Edit Attribute</DialogTitle>
      <DialogContent>
        <UpsertAttributeForm
          attribute={attribute}
          onChange={(attributeFormData) =>
            setAttributeFormData(attributeFormData)
          }
          errors={errors}
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
