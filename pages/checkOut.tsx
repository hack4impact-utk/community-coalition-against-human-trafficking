import CheckInOutForm from 'components/CheckInOutForm'
import {
  Box,
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
  checkInOutFormSchema,
  CheckInOutRequest,
  ItemDefinitionResponse,
  UserResponse,
} from 'utils/types'
import { GetServerSidePropsContext } from 'next'
import usersHandler from '@api/users'
import { apiWrapper } from 'utils/apiWrappers'
import categoriesHandler from '@api/categories'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'store'
import React from 'react'
import { checkInOutFormDataToCheckInOutRequest } from 'utils/transformations'
import { showSnackbar } from 'store/snackbar'
import transformZodErrors from 'utils/transformZodErrors'
import { LoadingButton } from '@mui/lab'
import urls from 'utils/urls'
import presentItemDefinitionsHandler from '@api/itemDefinitions/present'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      categories: await apiWrapper(categoriesHandler, context),
      itemDefinitions: await apiWrapper(presentItemDefinitionsHandler, context),
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
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const inventoryItem = React.useMemo(
    () =>
      !!router.query.inventoryItem
        ? JSON.parse(decodeURIComponent(router.query.inventoryItem as string))
        : undefined,
    [router.query.inventoryItem]
  )
  const dispatch = useAppDispatch()

  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'))

  const [formData, setFormData] = React.useState<CheckInOutFormData>(
    {} as CheckInOutFormData
  )
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setErrors((errors) => {
      return {
        ...errors,
        attributes: '',
        textFieldAttributes: '',
      }
    })
  }, [formData.itemDefinition])

  const onSubmit = async (formData: CheckInOutFormData) => {
    // necessary for navigation from kebab, which encodes assignee as null
    if (formData.assignee === null) {
      formData.assignee = undefined
    }

    const res = checkInOutFormSchema.safeParse(formData)

    if (!res.success) {
      setErrors(transformZodErrors(res.error))
      return
    }
    setErrors({})

    // when validation is added, must be done before this
    setLoading(true)
    const checkInOutRequest: CheckInOutRequest =
      checkInOutFormDataToCheckInOutRequest(formData)

    const response = await fetch(urls.api.inventoryItems.checkOut, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkInOutRequest),
    })

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
      setFormData((formData) => {
        return {
          user: formData.user,
          date: new Date(),
          quantityDelta: 0,
        } as CheckInOutFormData
      })
    } else {
      // @ts-ignore
      dispatch(showSnackbar({ message: data.message, severity: 'error' }))
    }
  }

  const kioskMode = useAppSelector((state) => state.kiosk)
  return (
    <Grid2 container my={2} sx={{ flexGrow: 1 }}>
      <Grid2 xs={12} sm={8} lg={6} smOffset={2} lgOffset={3}>
        <Card variant={isMobileView ? 'elevation' : 'outlined'} elevation={0}>
          <Box display="flex" flexDirection="column">
            <CardContent sx={{ p: 2 }}>
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
                errors={errors}
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
