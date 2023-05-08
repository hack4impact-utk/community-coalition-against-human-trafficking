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
import {
  CategoryResponse,
  CheckInOutFormData,
  CheckInOutRequest,
  InventoryItemRequest,
  ItemDefinitionResponse,
  LogRequest,
  UserResponse,
} from 'utils/types'
import { GetServerSidePropsContext } from 'next'
import usersHandler from '@api/users'
import itemDefinitionsHandler from '@api/itemDefinitions'
import { apiWrapper } from 'utils/apiWrappers'
import categoriesHandler from '@api/categories'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'store'
import React from 'react'
import { checkInOutFormDataToCheckInOutRequest } from 'utils/transformations'
import dayjs from 'dayjs'
import { showSnackbar } from 'store/snackbar'
import { LoadingButton } from '@mui/lab'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      categories: await apiWrapper(categoriesHandler, context),
      itemDefinitions: await apiWrapper(itemDefinitionsHandler, context),
      users: await apiWrapper(usersHandler, context),
    },
  }
}
interface Props {
  categories: CategoryResponse[]
  itemDefinitions: ItemDefinitionResponse[]
  users: UserResponse[]
}

export default function CheckOutPage({
  categories,
  itemDefinitions,
  users,
}: Props) {
  const theme = useTheme()
  const router = useRouter()
  const inventoryItem = !!router.query.inventoryItem
    ? JSON.parse(decodeURIComponent(router.query.inventoryItem as string))
    : undefined
  const dispatch = useAppDispatch()

  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'))

  const [formData, setFormData] = React.useState<CheckInOutFormData>(
    {} as CheckInOutFormData
  )

  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (formData: CheckInOutFormData) => {
    // when validation is added, must be done before this
    setLoading(true)
    const checkInOutRequest: CheckInOutRequest =
      checkInOutFormDataToCheckInOutRequest(formData)

    // TODO better way of coding URLs
    const response = await fetch(
      `http://localhost:3000/api/inventoryItems/checkOut`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkInOutRequest),
      }
    )

    const data = await response.json()
    setLoading(false)

    if (data.success) {
      // @ts-ignore
      dispatch(
        showSnackbar({
          message: 'Item successfully checked out.',
          severity: 'success',
        })
      )
    } else {
      // @ts-ignore
      dispatch(showSnackbar({ message: data.message, severity: 'error' }))
    }
    setFormData((formData) => {
      return {
        user: formData.user,
        date: dayjs(new Date()),
        quantityDelta: 0,
      } as CheckInOutFormData
    })
  }

  const kioskMode = useAppSelector((state) => state.kiosk)
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
                kioskMode={kioskMode.enabled}
                users={users}
                itemDefinitions={itemDefinitions}
                categories={categories}
                formData={formData}
                setFormData={setFormData}
                inventoryItem={inventoryItem}
              />
            </CardContent>

            <CardActions
              sx={{ mt: { xs: 1, sm: 0 }, alignSelf: { xs: 'end' } }}
            >
              <LoadingButton
                onClick={() => onSubmit(formData)}
                variant="contained"
                loading={loading}
              >
                Check Out
              </LoadingButton>
            </CardActions>
          </Box>
        </Card>
      </Grid2>
    </Grid2>
  )
}
