import {
  Autocomplete,
  Box,
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

type PossibleValues = 'text' | 'number' | 'list'
interface AttributeFormData {
  name: string
  color: string
  valueType: PossibleValues
  listOptions: string[]
}
interface AttributeFormProps {
  onSubmit: (e: React.SyntheticEvent, attrFormData: AttributeFormData) => void
}

export default function AttributeForm({ onSubmit }: AttributeFormProps) {
  const [formData, setFormData] = React.useState<AttributeFormData>({
    name: '',
    color: '#ebebeb',
    valueType: 'text',
    listOptions: [],
  })

  return (
    <form>
      <Grid2 container sx={{ flexGrow: 1 }}>
        <Grid2 xs={12}>
          <TextField
            label="Attribute Name"
            fullWidth
            onBlur={(e) => {
              setFormData({
                ...formData,
                name: e.target.value,
              } as AttributeFormData)
            }}
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
                    key={option}
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
            Add Attribute
          </Button>
        </Grid2>
      </Grid2>
    </form>
  )
}
