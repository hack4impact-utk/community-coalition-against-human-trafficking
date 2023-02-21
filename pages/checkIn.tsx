import CheckInOutForm from '../components/CheckInOutForm'
import { Box, Button, Card, CardContent, CardActions, Grid, Typography } from '@mui/material'

export default function CheckInPage() {
  return (
    <Grid container direction='row' justifySelf='center' sx={{width: '80%'}}>

      {/* Card and Grid for form and submit button. */}
      <Grid item alignSelf='center'>
        <Card>
          <Grid container direction='column'>

            <Grid item>
              <CardContent>
                <Typography variant='h6'>Check In Items</Typography>
                <CheckInOutForm kioskMode={true} users={[]} itemDefinitions={[]}/>
              </CardContent>
            </Grid>

            <Grid item alignSelf='flex-end'>
              <CardActions>
                <Button variant='contained'>Check In</Button>
              </CardActions>
            </Grid>

          </Grid>
        </Card>
      </Grid>

      <Grid item alignSelf='flex-start'>
        <Button variant='outlined'>Create New Item</Button> {/* How to align this properly */}
      </Grid>

    </Grid>
  )
}
