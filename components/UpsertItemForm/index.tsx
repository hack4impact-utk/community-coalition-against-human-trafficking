import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
} from '@mui/material'
import { AttributeResponse, CategoryResponse } from 'utils/types'

interface Props {
  categories: CategoryResponse[]
  attributes: AttributeResponse[]
}

export default function UpsertItemForm({ categories, attributes }: Props) {
  return (
    <FormControl fullWidth>
      <FormControlLabel
        control={<Checkbox defaultChecked />}
        label="Check out to clients?"
        sx={{ marginTop: 4 }}
      />
      <TextField label="Item Name" variant="outlined" sx={{ marginTop: 4 }} />
      <Autocomplete
        multiple
        options={attributes}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Attribute" />}
      />
    </FormControl>
  )
}
