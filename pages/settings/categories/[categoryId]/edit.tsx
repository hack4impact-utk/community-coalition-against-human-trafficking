import { LoadingButton } from '@mui/lab'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import UpsertCategoryForm from 'components/UpsertCategoryForm'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { showSnackbar } from 'store/snackbar'
import transformZodErrors from 'utils/transformZodErrors'
import { CategoryResponse, categoryFormSchema } from 'utils/types'

export default function CategoryEditForm() {
  const [categoryFormData, setCategoryFormData] = useState<CategoryResponse>(
    {} as CategoryResponse
  )
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>(
    {} as Record<string, string>
  )
  const router = useRouter()
  const dispatch = useDispatch()

  const handleClose = async () => {
    await router.push('/settings/categories')
  }

  // get id from URL and get categories
  const { id } = router.query
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return // on page load, id is undefined, resulting in bad requests
      const response = await fetch(`/api/categories/${id}`, { method: 'GET' })
      const data = await response.json()
      setCategoryFormData(data.payload)
    }
    fetchCategory()
  }, [id])

  const handleSubmit = async (categoryFormData: CategoryResponse) => {
    // form validation
    const zodResponse = categoryFormSchema.safeParse(categoryFormData)
    if (!zodResponse.success) {
      setErrors(transformZodErrors(zodResponse.error))
      return
    }
    // update category
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: id,
        name: categoryFormData,
      }),
    })

    // close dialog
    handleClose()

    // handle snackbar logic
    const data = await response.json()
    if (data.success) {
      dispatch(
        showSnackbar({
          message: 'Category successfully edited',
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
      <DialogTitle>Edit Category</DialogTitle>
      <DialogContent>
        <UpsertCategoryForm
          category={categoryFormData}
          onChange={(newName) =>
            setCategoryFormData({ ...categoryFormData, name: newName })
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
