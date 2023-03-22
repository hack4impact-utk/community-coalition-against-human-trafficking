import CheckInOutForm from 'components/CheckInOutForm'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Unstable_Grid2 as Grid2,
  useMediaQuery,
  useTheme,
} from '@mui/material'

export default function CheckOutPage() {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Grid2 container my={2} sx={{ flexGrow: 1 }}>
      <Grid2 xs={12} sm={8} lg={6} smOffset={2} lgOffset={3}>
        <Card variant={isMobileView ? 'elevation' : 'outlined'} elevation={0}>
          <Box display="flex" flexDirection="column">
            <CardContent sx={{ p: isMobileView ? 0 : 2 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Check out items
              </Typography>
              <CheckInOutForm
                kioskMode={true}
                users={[]}
                itemDefinitions={[]}
                attributes={[]}
                categories={[]}
              />
            </CardContent>

            <CardActions
              sx={{ mt: { xs: 1, sm: 0 }, alignSelf: { xs: 'end' } }}
            >
              <Button variant="contained">Check out</Button>
            </CardActions>
          </Box>
        </Card>
      </Grid2>
    </Grid2>
  )
}
