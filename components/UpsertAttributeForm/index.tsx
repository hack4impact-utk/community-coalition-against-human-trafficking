import {
  Autocomplete,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Unstable_Grid2 as Grid2,
} from '@mui/material'
import React, { useEffect } from 'react'
import { TwitterPicker } from 'react-color'
import getContrastYIQ from 'utils/getContrastYIQ'
import { Attribute, AttributeFormData, AttributeRequest } from 'utils/types'

interface AttributeFormProps {
  attribute?: AttributeRequest
  onChange: (attrFormData: AttributeFormData) => void
  children?: React.ReactNode // contains the form buttons (Add/Edit/Cancel)
  errors: Record<keyof AttributeFormData, string>
}

function transformAttributeToFormData(
  attr?: Attribute
): Partial<AttributeFormData> {
  if (!attr)
    return {
      name: '',
      color: '#ebebeb',
      listOptions: [],
      valueType: null,
    }

  const result = {
    name: attr.name,
    color: attr.color,
  }

  if (attr.possibleValues instanceof Array) {
    return {
      ...result,
      valueType: 'list',
      listOptions: attr.possibleValues,
    }
  }

  return {
    ...result,
    valueType: attr.possibleValues,
  }
}

export default function UpsertAttributeForm({
  onChange,
  attribute,
  children,
  errors,
}: AttributeFormProps) {
  const [formData, setFormData] = React.useState<AttributeFormData>(
    transformAttributeToFormData(attribute) as AttributeFormData
  )

  // the attribute passed into this form is sometimes undefined as it is still being fetched
  // Thus, make sure to fill out the form when the attribute gets fetched
  useEffect(() => {
    setFormData(transformAttributeToFormData(attribute) as AttributeFormData)
  }, [attribute])

  React.useEffect(() => {
    onChange(formData)
  }, [onChange, formData])

  return (
    <form>
      <Grid2 container sx={{ flexGrow: 1 }}>
        <Grid2 xs={12}>
          <TextField
            label="Attribute Name"
            fullWidth
            onChange={(e) => {
              setFormData({
                ...formData,
                name: e.target.value,
              } as AttributeFormData)
            }}
            value={formData.name}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid2>
        <Grid2 xs={6} sx={{ mt: 2 }}>
          <FormLabel>Color</FormLabel>
          <TwitterPicker
            triangle="hide"
            styles={{ default: { card: { boxShadow: 'none' } } }}
            onChangeComplete={(color) => {
              setFormData({
                ...formData,
                color: color.hex,
              } as AttributeFormData)
            }}
            color={formData.color}
          />
        </Grid2>
        <Grid2 xs={12} sx={{ mt: 2, display: 'block' }}>
          <FormControl>
            <FormLabel>Possible values</FormLabel>
            <RadioGroup
              row
              name="row-radio-buttons-group"
              onChange={(_e, value) => {
                setFormData({
                  ...formData,
                  valueType: value,
                } as AttributeFormData)
              }}
              value={formData.valueType}
            >
              <FormControlLabel
                value="list"
                control={<Radio />}
                label="Choose from List"
              />
              <FormControlLabel value="text" control={<Radio />} label="Text" />
              <FormControlLabel
                value="number"
                control={<Radio />}
                label="Number"
              />
            </RadioGroup>
            {errors.valueType && (
              <Typography
                variant="caption"
                color={(theme) => theme.palette.error.main}
              >
                Must select one.
              </Typography>
            )}
          </FormControl>
        </Grid2>
        {formData?.valueType == 'list' && (
          <Grid2 xs={12} sx={{ mt: 2 }}>
            <Autocomplete
              autoHighlight
              freeSolo
              multiple
              value={formData.listOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Attribute Values"
                  error={!!errors.listOptions}
                  helperText={errors.listOptions}
                />
              )}
              options={[]}
              onChange={(_e, value) => {
                setFormData({
                  ...formData,
                  listOptions: value,
                } as AttributeFormData)
              }}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    label={option}
                    sx={{
                      backgroundColor: formData.color,
                      '& .MuiChip-label': {
                        color: getContrastYIQ(formData.color),
                      },
                    }}
                    {...getTagProps({ index })}
                    key={index}
                  />
                ))
              }
            />
          </Grid2>
        )}
        {children}
      </Grid2>
    </form>
  )
}
