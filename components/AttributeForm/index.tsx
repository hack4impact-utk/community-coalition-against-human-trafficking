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
import React from 'react'
import { TwitterPicker } from 'react-color'
import getContrastYIQ from 'utils/getContrastYIQ'
import { Attribute, AttributeRequest } from 'utils/types'

type PossibleValues = 'text' | 'number' | 'list'
interface AttributeFormData {
  name: string
  color: string
  valueType: PossibleValues
  listOptions?: string[]
}
interface AttributeFormProps {
  attribute?: AttributeRequest
  onSubmit: (e: React.SyntheticEvent, attrFormData: AttributeFormData) => void
  submitBtnText: string
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

export default function AttributeForm({
  onSubmit,
  attribute,
  submitBtnText,
}: AttributeFormProps) {
  const [formData, setFormData] = React.useState<AttributeFormData>(
    transformAttributeToFormData(attribute)
  )

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
        <Grid2 xs={12} sx={{ mt: 2 }} display="flex" justifyContent="flex-end">
          <Button
            variant="outlined"
            size="large"
            onClick={(e) => onSubmit(e, formData)}
          >
            {submitBtnText}
          </Button>
        </Grid2>
      </Grid2>
    </form>
  )
}
