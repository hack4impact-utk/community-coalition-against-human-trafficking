import { Box, Typography, Button } from '@mui/material'
import AttributeList from 'components/AttributeList'
import SearchField from 'components/SearchField'
import { AttributeResponse } from 'utils/types'
import AddIcon from '@mui/icons-material/Add';

const attributes: AttributeResponse[] = [
  { _id: '1', name: 'attribute', possibleValues: 'number', color: '#666666' },
  { _id: '2', name: 'attribute2', possibleValues: 'text', color: '#123456' },
  {
    _id: '3',
    name: 'attribute3',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
  {
    _id: '4',
    name: 'b',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
  {
    _id: '5',
    name: 'c',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
  {
    _id: '6',
    name: 'd',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
  {
    _id: '7',
    name: 'e',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
  {
    _id: '8',
    name: 'f',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
]

export default function AttributesPage() {
  return (
    <Box display="flex" flexDirection="column" mt={2}>
      <Box display="flex">
        <Typography variant="h5" sx={{ ml: 2 }}>
          Attributes
        </Typography>
        <Button variant="outlined" startIcon={<AddIcon />} sx={{ ml: 'auto', mr: 2 }}>
          Create New Attribute
        </Button>
      </Box>
      <Box width="33%" ml={2}>
        <SearchField />
      </Box>
      <AttributeList attributes={attributes} search={''} />
    </Box>
  )
}
