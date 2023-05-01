import {
  Autocomplete,
  Button,
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
import { Attribute, AttributeRequest } from 'utils/types'

type PossibleValues = 'text' | 'number' | 'list'
export interface AttributeFormData {
  name: string
  color: string
  valueType: PossibleValues
  listOptions?: string[]
}
interface AttributeFormProps {
  attribute?: AttributeRequest
  onChange: (attrFormData: AttributeFormData) => void
  children?: React.ReactNode // contains the form buttons (Add/Edit/Cancel)
}

function transformAttributeToFormData(attr?: Attribute): AttributeFormData {
  if (!attr)
    return {
      name: '',
      color: '#ebebeb',
      valueType: 'text',
      listOptions: [],
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
}: AttributeFormProps) {
  const [formData, setFormData] = React.useState<AttributeFormData>(
    transformAttributeToFormData(attribute)
  )
  
  // the attribute passed into this form is sometimes undefined as it is still being fetched
  // Thus, make sure to fill out the form when the attribute gets fetched
  useEffect(() => {
    setFormData(transformAttributeToFormData(attribute))
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
              <FormControlLabel value="text" control={<Radio />} label="Text" />
              <FormControlLabel
                value="number"
                control={<Radio />}
                label="Number"
              />
              <FormControlLabel
                value="list"
                control={<Radio />}
                label="Choose from List"
              />
            </RadioGroup>
          </FormControl>
        </Grid2>
        {formData?.valueType == 'list' && (
          <Grid2 xs={12} sx={{ mt: 2 }}>
            <Autocomplete
              freeSolo
              multiple
              value={formData.listOptions}
              renderInput={(params) => (
                <TextField {...params} label="Attribute Values" />
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
