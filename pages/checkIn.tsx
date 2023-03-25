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

const testCategories = [
  {
    _id: '1',
    name: 'testCategory',
  },
  {
    _id: '2',
    name: 'testCategory2',
  },
]

const testItemDefinitions = [
  {
    _id: '1',
    name: 'testItemDefinition',
    category: testCategories[0],
    internal: true,
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    attributes: [
      {
        _id: '1',
        name: 'testAttribute',
        possibleValues: ['test1', 'test2'],
        color: '#FF0000',
      },
      {
        _id: '2',
        name: 'test2',
        possibleValues: 'number',
        color: '#00FF00',
      },
    ],
  },
  {
    _id: '2',
    name: 'testItemDefinition2',
    category: testCategories[1],
    internal: true,
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    attributes: [
      {
        _id: '1',
        name: 'testAttribute',
        possibleValues: ['test1', 'test2'],
        color: '#FF0000',
      },
      {
        _id: '2',
        name: 'test2',
        possibleValues: 'number',
        color: '#00FF00',
      },
    ],
  },
]

export default function CheckInPage() {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Grid2 container sx={{ flexGrow: 1 }}>
      <Grid2
        xs={12}
        sm={8}
        lg={6}
        display="flex"
        justifyContent="flex-end"
        smOffset={2}
        lgOffset={3}
      >
        <Button
          variant="outlined"
          fullWidth={isMobileView}
          size="large"
          sx={{ my: 2 }}
        >
          Create new item
        </Button>
      </Grid2>

      <Grid2 xs={12} sm={8} lg={6} smOffset={2} lgOffset={3}>
        <Card variant={isMobileView ? 'elevation' : 'outlined'} elevation={0}>
          <Box display="flex" flexDirection="column">
            <CardContent sx={{ p: isMobileView ? 0 : 2 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Check in items
              </Typography>
              <CheckInOutForm
                kioskMode={true}
                users={[]}
                itemDefinitions={testItemDefinitions}
                categories={testCategories}
                onChange={(item) => {
                  console.log(item)
                }}
              />
            </CardContent>

            <CardActions
              sx={{ alignSelf: { xs: 'end' }, mt: { xs: 1, sm: 0 } }}
            >
              <Button variant="contained">Check in</Button>
            </CardActions>
          </Box>
        </Card>
      </Grid2>
    </Grid2>
  )
}
