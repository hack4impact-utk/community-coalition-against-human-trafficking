import { TextField } from '@mui/material'
import React from 'react'
import { CategoryResponse } from 'utils/types'

interface CategoryFormProps {
  category?: CategoryResponse
  onChange: (categoryFormData: string) => void
}
export default function UpsertCategoryForm({
  onChange,
  category,
}: CategoryFormProps) {
  const [formData, setFormData] = React.useState<string>(category?.name || '')

  React.useEffect(() => {
    setFormData(category?.name || '')
  }, [category?.name])

  React.useEffect(() => {
    onChange(formData)
  }, [onChange, formData])

  return (
    <>
      <TextField
        label="Category Name"
        fullWidth
        onChange={(e) => {
          setFormData(e.target.value)
        }}
        value={formData}
      />
    </>
  )
}
