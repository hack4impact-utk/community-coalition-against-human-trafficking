import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { useDispatch } from 'react-redux'
import { showSnackbar } from 'store/snackbar'
import UpsertCategoryForm from 'components/UpsertCategoryForm'
import transformZodErrors from 'utils/transformZodErrors'
import { CategoryFormData, categoryFormSchema } from 'utils/types'
import urls from 'utils/urls'
import { removeURLQueryParam } from 'utils/queryParams'

export default function CategoryCreateForm() {
  const [loading, setLoading] = useState(false)
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    name: '',
  })

  const router = useRouter()
  const dispatch = useDispatch()

  const handleClose = async () => {
    await removeURLQueryParam(router, 'showDialog')
  }
  const [errors, setErrors] = useState<Record<string, string>>(
    {} as Record<string, string>
  )
  const handleSubmit = async (categoryFormData: CategoryFormData) => {
    // form validation
    const zodResponse = categoryFormSchema.safeParse(categoryFormData)
    if (!zodResponse.success) {
      setErrors(transformZodErrors(zodResponse.error))
      return
    }
    // add category
    const response = await fetch(urls.api.categories.categories, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryFormData),
    })

    // handle snackbar logic
    const data = await response.json()
    if (data.success) {
      // close dialog
      await handleClose()
      dispatch(
        showSnackbar({
          message: 'Category successfully added',
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
      <DialogTitle>Create Category</DialogTitle>
      <DialogContent sx={{ overflowY: 'visible' }}>
        <UpsertCategoryForm
          onChange={(name) => setCategoryFormData({ name })}
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
            await handleSubmit(categoryFormData)
            setLoading(false)
          }}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </>
  )
}
