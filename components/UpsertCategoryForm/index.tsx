import {
  Autocomplete,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Unstable_Grid2 as Grid2,
} from '@mui/material'
import React, { useEffect } from 'react'
import { TwitterPicker } from 'react-color'
import getContrastYIQ from 'utils/getContrastYIQ'
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
