import CheckInOutForm from '../components/CheckInOutForm'
import { Button, Card, CardContent, CardActions, Grid, Typography } from '@mui/material'

export default function CheckInPage() {
  return (
    <>
      <Grid container direction='column' justifySelf='center'>
        <Grid item alignSelf='flex-end'>
          <Button variant='outlined'>Create New Item</Button> {/* How to align this properly */}
        </Grid>
        <Grid item alignSelf='center'>
          <Card sx={{minWidth: 600}}>
            <Grid container direction='column'>
              <Grid item>
                <CardContent>
                  <Typography variant='h6'>Check In Items</Typography>
                  <CheckInOutForm/> {/* What to do with props */}
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
      </Grid>
    </>
  )
}