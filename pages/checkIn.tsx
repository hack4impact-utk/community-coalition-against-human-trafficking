import CheckInOutForm from 'components/CheckInOutForm'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  useMediaQuery,
} from '@mui/material'

export default function CheckInPage() {
  const isMobileView = useMediaQuery('(max-width: 600px)')
  return (
    <Box
      mx="auto"
      display="flex"
      flexDirection="column"
      maxWidth="min(600px, 80%)"
    >
      <Button variant="outlined" sx={{ flexGrow: 0 }}>
        Create new item
      </Button>
      <Card variant={isMobileView ? 'elevation' : 'outlined'} elevation={0}>
        <Box px="1.5rem" py="2rem" display="flex" flexDirection="column">
          <CardContent>
            <Typography variant="h4" fontSize="1.5rem" mb="1rem">
              Check in items
            </Typography>
            <CheckInOutForm kioskMode={true} users={[]} itemDefinitions={[]} />
          </CardContent>

          <CardActions
            sx={{ alignSelf: { xs: 'center', sm: 'end' }, pr: '16px' }}
          >
            <Button variant="contained" sx={{ mt: '-8px' }}>
              Check in
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Box>
  )
}
