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
import { CategoryResponse } from 'utils/types'
import { createResponse } from 'node-mocks-http'
import categoriesHandler from '@api/categories'
import { GetServerSidePropsContext, NextApiRequest } from 'next'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res = createResponse()
  await categoriesHandler(context.req as NextApiRequest, res)
  const responseData: CategoryResponse[] = res._getJSONData().payload
  return {
    props: { categories: responseData },
  }
}
interface Props {
  categories: CategoryResponse[]
}

export default function CheckInPage({ categories }: Props) {
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
                itemDefinitions={[]}
                attributes={[]}
                categories={categories}
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
