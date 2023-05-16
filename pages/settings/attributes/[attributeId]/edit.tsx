import { LoadingButton } from '@mui/lab'
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
import { useDispatch } from 'react-redux'
import { showSnackbar } from 'store/snackbar'
import urls from 'utils/urls'

export default function AttributeEditDialog() {
  // you have to do this to otherwise the AttributeForm says that
  // attribute is being used before its given a value
  const [attribute, setAttribute] = useState<AttributeResponse>()
  const [errors, setErrors] = useState<Record<keyof AttributeFormData, string>>(
    {} as Record<keyof AttributeFormData, string>
  )
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
      const response = await fetch(
        urls.api.attributes.attribute(id as string),
        {
          method: 'GET',
        }
      )
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
      // update attribute
      const response = await fetch(
        urls.api.attributes.attribute(id as string),
        {
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
        }
      )
      // handle snackbar logic
      const data = await response.json()

      // close dialog
      await router.push(urls.pages.settings.attributes)

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
    },
    [id, router]
  )

  const handleClose = () => {
    router.push(urls.pages.settings.attributes)
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
          errors={errors}
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
