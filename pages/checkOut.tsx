import CheckInOutForm from '../components/CheckInOutForm'
import { Box, Button } from '@mui/material'
import { Typography } from '@mui/material'

export default function CheckOutPage() {
  return (
    <Box
      sx={{
        boxShadow: 1,
        maxWidth: 'min(600px, 90%)',
        marginInline: 'auto',
        marginTop: '2rem',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" fontSize={24} sx={{ marginBottom: '1rem' }}>
        Check out items
      </Typography>

      {/* TODO: Add props to CheckInOutForm */}
      <CheckInOutForm
        kioskMode={true}
        users={[]}
        itemDefinitions={[]}
      ></CheckInOutForm>

      <Button variant="contained" sx={{ alignSelf: 'end', marginTop: '1rem' }}>
        Check out
      </Button>
    </Box>
  )
}
