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
  ItemDefinitionResponse,
  UserResponse,
} from 'utils/types'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { checkInOutFormDataToCheckInOutRequest } from 'utils/transformations'
import { apiWrapper } from 'utils/apiWrappers'
import usersHandler from '@api/users'
import itemDefinitionsHandler from '@api/itemDefinitions'
import categoriesHandler from '@api/categories'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'store'
import dayjs from 'dayjs'
import DialogLink from 'components/DialogLink'
import { KioskState } from 'store/types'
import RoutableDialog from 'components/RoutableDialog'
import NewItemPage from './items/new'
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

export default function CheckInPage({
  categories,
  itemDefinitions,
  users,
}: Props) {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  const dispatch = useAppDispatch()
  const inventoryItem = !!router.query.inventoryItem
    ? JSON.parse(decodeURIComponent(router.query.inventoryItem as string))
    : undefined
  const [defaultItemDef, setDefaultItemDef] = React.useState(
    itemDefinitions.find((id) => id._id === router.query.item)
  )
  const kioskMode = useAppSelector(
    (state: { kiosk: KioskState }) => state.kiosk
  )

  React.useEffect(() => {
    setDefaultItemDef(
      itemDefinitions.find((id) => id._id === router.query.item)
    )
  }, [router.query.item, itemDefinitions])

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
      `http://localhost:3000/api/inventoryItems/checkIn`,
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
          message: 'Item successfully checked in.',
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

  return (
    <>
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
          <DialogLink href="/items/new">
            <Button
              variant="outlined"
              fullWidth={isMobileView}
              size="large"
              sx={{ my: 2 }}
            >
              Create new item
            </Button>
          </DialogLink>
        </Grid2>

        <Grid2 xs={12} sm={8} lg={6} smOffset={2} lgOffset={3}>
          <Card variant={isMobileView ? 'elevation' : 'outlined'} elevation={0}>
            <Box display="flex" flexDirection="column">
              <CardContent sx={{ p: isMobileView ? 0 : 2 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Check in items
                </Typography>
                <CheckInOutForm
                  kioskMode={kioskMode.enabled}
                  users={users}
                  itemDefinitions={itemDefinitions}
                  categories={categories}
                  formData={formData}
                  setFormData={setFormData}
                  inventoryItem={inventoryItem}
                  itemDefinition={defaultItemDef}
                />
              </CardContent>

              <CardActions
                sx={{ alignSelf: { xs: 'end' }, mt: { xs: 1, sm: 0 } }}
              >
                <LoadingButton
                  onClick={() => onSubmit(formData)}
                  variant="contained"
                  loading={loading}
                >
                  Check In
                </LoadingButton>
              </CardActions>
            </Box>
          </Card>
        </Grid2>
      </Grid2>
      <RoutableDialog>
        <NewItemPage
          redirectBack={(router, itemId) => {
            if (!itemId) return router.push('/checkIn')
            router.push(`/checkIn?item=${itemId}`)
          }}
        />
      </RoutableDialog>
    </>
  )
}
