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

export default function CategoryEditForm() {
  const [category, setCategory] = useState<string>()
  const [categoryFormData, setCategoryFormData] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  // get id from URL and get categories
  const { id } = router.query
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return // on page load, id is undefined, resulting in bad requests
      const response = await fetch(`/api/category/${id}`, { method: 'GET' })
      const data = await response.json()
      setCategory(data.payload)
    }
    fetchCategory()
  }, [id])

  const handleSubmit = async (categoryFormData: string) => {
    // update category
    const response = await fetch(`/api/category/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'category/json' },
      body: JSON.stringify({
        _id: id,
        name: categoryFormData,
      }),
    })

    // close dialog
    await router.push('/settings/category')

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

  const handleClose = () => {
    router.push('/settings/categories')
  }

  return (
    <>
      <DialogTitle>Edit Category</DialogTitle>
      <DialogContent>
        <UpsertCategoryForm
          onChange={(categoryFormData) => setCategoryFormData(categoryFormData)}
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
