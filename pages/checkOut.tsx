import CheckInOutForm from '../components/CheckInOutForm'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material'

export default function CheckOutPage() {
  return (
    <Box mt={4} mx={'auto'} maxWidth={"min(600px, 80%)"}>
      <Card variant="outlined">
        <Box p={4} display={'flex'} flexDirection={'column'}>
          <CardContent>
            <Typography variant="h4" fontSize={'1.5rem'} mb={2}>
              Check out items
            </Typography>
            <CheckInOutForm kioskMode={true} users={[]} itemDefinitions={[]} />
          </CardContent>

          <CardActions sx={{ alignSelf: 'end' }}>
            <Button variant="contained">Check out</Button>
          </CardActions>
        </Box>
      </Card>
    </Box>
  )
}
