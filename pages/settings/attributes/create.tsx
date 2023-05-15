import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import UpsertAttributeForm from 'components/UpsertAttributeForm'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { useDispatch } from 'react-redux'
import { showSnackbar } from 'store/snackbar'
import { AttributeFormData, attributeFormSchema } from 'utils/types'
import transformZodErrors from 'utils/transformZodErrors'
import urls from 'utils/urls'

export default function AttributeCreateDialog() {
  const [loading, setLoading] = useState(false)
  const [attributeFormData, setAttributeFormData] = useState<AttributeFormData>(
    {} as AttributeFormData
  )
  const [errors, setErrors] = useState<Record<keyof AttributeFormData, string>>(
    {} as Record<keyof AttributeFormData, string>
  )

  const router = useRouter()
  const dispatch = useDispatch()

  const handleClose = () => {
    router.push(urls.pages.settings.attributes)
  }

  const handleSubmit = async (attributeFormData: AttributeFormData) => {
    // form validation
    const zodResponse = attributeFormSchema.safeParse(attributeFormData)
    if (!zodResponse.success) {
      setErrors(transformZodErrors(zodResponse.error))
      return
    }

    // add attribute to database
    const response = await fetch(urls.api.attributes.attributes, {
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

    // close dialog
    await router.push(urls.pages.settings.attributes)

    // handle snackbar logic
    const data = await response.json()
    if (data.success) {
      dispatch(
        showSnackbar({
          message: 'Attribute successfully added',
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

  return (
    <>
      <DialogTitle>Create Attribute</DialogTitle>
      <DialogContent sx={{ overflowY: 'visible' }}>
        <UpsertAttributeForm
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
