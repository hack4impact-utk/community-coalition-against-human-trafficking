import {
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
} from '@mui/material'
import { Attribute, Category } from 'utils/types'

interface Props {
  categories: Category[]
  attributes: Attribute[]
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
    </FormControl>
  )
}
