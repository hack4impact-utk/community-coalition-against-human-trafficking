import { Button, Typography, Unstable_Grid2 as Grid2 } from '@mui/material'
import SearchField from 'components/SearchField'
import AddIcon from '@mui/icons-material/Add'

export default function ItemsPage() {
  return (
    <Grid2 container my={2} sx={{ flexGrow: 1, px: 2 }} gap={2}>
      <Grid2 xs={12} container direction={'row'}>
        <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
          Items
        </Typography>
        <Grid2 ml="auto" mr={6}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ width: '100%' }}
          >
            Create New Item
          </Button>
        </Grid2>
      </Grid2>
      <Grid2 xs={12} md={5} lg={4} sx={{ px: 2 }}>
        <SearchField />
      </Grid2>
    </Grid2>
  )
}
