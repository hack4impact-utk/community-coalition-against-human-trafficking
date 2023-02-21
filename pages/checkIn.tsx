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
        gap: '10px',
      }}
    >
      <Card sx={{ width: '40%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <Typography variant="h5">Check in items</Typography>
            <CheckInOutForm kioskMode={true} users={[]} itemDefinitions={[]} />
          </CardContent>

          <CardActions sx={{ alignSelf: 'flex-end' }}>
            <Button variant="contained">Check In</Button>
          </CardActions>
        </Box>
      </Card>

      <Button variant="outlined" sx={{ alignSelf: 'flex-start' }}>
        Create New Item
      </Button>
    </Box>
  )
}
