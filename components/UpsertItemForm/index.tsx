import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AttributeResponse, CategoryResponse } from 'utils/types'

interface Props {
  categories: CategoryResponse[]
  attributes: AttributeResponse[]
}

export default function UpsertItemForm({ categories, attributes }: Props) {
  return (
    <FormControl fullWidth>
      <Autocomplete
        options={categories}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Category" />}
        sx={{ marginTop: 4 }}
      />

      <FormControlLabel
        control={<Checkbox defaultChecked />}
        label="Check out to clients?"
        sx={{ marginTop: 4 }}
      />

      <TextField label="Item Name" variant="outlined" sx={{ marginTop: 4 }} />

      {/* Attribute Autocomplete and Create Attribute Button */}
      <Box
        sx={{
          display: 'flex',
          alignSelf: 'flex-start',
          marginTop: 4,
          width: '100%',
        }}
      >
        <Autocomplete
          multiple
          options={attributes}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Attribute" />}
          sx={{ marginRight: 2, alignSelf: 'center' }}
          fullWidth
        />
        <IconButton size="large">
          <AddIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Low Stock Threshold Prompt */}
      <Box sx={{ display: 'flex', alignSelf: 'flex-start', marginTop: 4 }}>
        <Typography
          variant="body1"
          sx={{ marginRight: 2, alignSelf: 'center' }}
        >
          Display warning on dashboard when quantity drops below
        </Typography>
        <TextField
          sx={{
            width: 56,
            marginRight: 1.5,
          }}
          onChange={(e) => {
            Number(e.target.value) < 0 ? (e.target.value = '0') : e.target.value
          }}
          type="tel"
          InputProps={{
            inputProps: { min: 1, style: { textAlign: 'center' } },
          }}
        />
      </Box>

      {/* Critical Stock Threshold Prompt */}
      <Box sx={{ display: 'flex', alignSelf: 'flex-start', marginTop: 4 }}>
        <Typography
          variant="body1"
          sx={{ marginRight: 2, alignSelf: 'center' }}
        >
          Send email notification when quantity drops below
        </Typography>
        <TextField
          sx={{
            width: 56,
            marginRight: 1.5,
          }}
          onChange={(e) => {
            Number(e.target.value) < 0 ? (e.target.value = '0') : e.target.value
          }}
          type="tel"
          InputProps={{
            inputProps: { min: 1, style: { textAlign: 'center' } },
          }}
        />
      </Box>
    </FormControl>
  )
}
