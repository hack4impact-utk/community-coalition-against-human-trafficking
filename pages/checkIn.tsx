import CheckInOutForm from '../components/CheckInOutForm'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material'

export default function CheckInPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'center',
        gap: '30px',
      }}
    >
      <Card sx={{ width: '30%', marginTop: '50px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <Typography variant="h5" sx={{ marginBottom: '30px' }}>
              Check in items
            </Typography>
            <CheckInOutForm kioskMode={true} users={[]} itemDefinitions={[]} />
          </CardContent>

          <CardActions sx={{ alignSelf: 'flex-end' }}>
            <Button
              variant="contained"
              sx={{ marginBottom: '10px', marginRight: '10px' }}
            >
              Check In
            </Button>
          </CardActions>
        </Box>
      </Card>

      <Button
        variant="outlined"
        sx={{ alignSelf: 'flex-start', marginTop: '30px' }}
      >
        Create New Item
      </Button>
    </Box>
  )
}
