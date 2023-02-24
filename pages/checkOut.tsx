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

import { useEffect } from 'react'
export default function CheckOutPage() {
  const isMobileView = useMediaQuery('(max-width: 600px)')
  return (
    <Box mt="2rem" mx="auto" maxWidth="min(600px, 80%)">
      <Card variant={isMobileView ? 'elevation' : 'outlined'} elevation={0}>
        <Box px="1.5rem" py="2rem" display="flex" flexDirection="column">
          <CardContent>
            <Typography variant="h4" fontSize="1.5rem" mb="1rem">
              Check out items
            </Typography>
            <CheckInOutForm kioskMode={true} users={[]} itemDefinitions={[]} />
          </CardContent>

          <CardActions
            sx={{
              alignSelf: { xs: 'center', sm: 'end' },
              pr: { xs: 0, sm: '16px' },
            }}
          >
            <Button variant="contained" sx={{ mt: '-8px' }}>
              Check out
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Box>
  )
}
