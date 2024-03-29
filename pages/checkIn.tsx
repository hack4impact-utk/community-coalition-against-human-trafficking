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
  checkInOutFormSchema,
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
import transformZodErrors from 'utils/transformZodErrors'
import { useAppDispatch, useAppSelector } from 'store'
import DialogLink from 'components/DialogLink'
import { KioskState } from 'store/types'
import RoutableDialog from 'components/RoutableDialog'
import NewItemPage from './items/new'
import { showSnackbar } from 'store/snackbar'
import { LoadingButton } from '@mui/lab'
import urls from 'utils/urls'

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
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const dispatch = useAppDispatch()
  const inventoryItem = React.useMemo(
    () =>
      !!router.query.inventoryItem
        ? JSON.parse(decodeURIComponent(router.query.inventoryItem as string))
        : undefined,
    [router.query.inventoryItem]
  )
  const [defaultItemDef, setDefaultItemDef] = React.useState(
    itemDefinitions.find((id) => id._id === router.query.item)
  )
  const kioskMode = useAppSelector(
    (state: { kiosk: KioskState }) => state.kiosk
  )
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setDefaultItemDef(
      itemDefinitions.find((id) => id._id === router.query.item)
    )
  }, [router.query.item, itemDefinitions])

  const [formData, setFormData] = React.useState<CheckInOutFormData>(
    {} as CheckInOutFormData
  )

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

    const response = await fetch(urls.api.inventoryItems.checkIn, {
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
          message: 'Item successfully checked in.',
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

  return (
    <>
      <Grid2 container my={2} sx={{ flexGrow: 1 }}>
        <Grid2 xs={12} sm={8} lg={6} smOffset={2} lgOffset={3}>
          <Card variant={isMobileView ? 'elevation' : 'outlined'} elevation={0}>
            <Box display="flex" flexDirection="column">
              <CardContent sx={{ p: 2 }}>
                <Grid2 xs={12} container direction={'row'}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Check in items
                  </Typography>
                  <Grid2 ml="auto">
                    <DialogLink href={urls.pages.dialogs.createItemDefinition}>
                      <Button variant="outlined" sx={{ width: '100%' }}>
                        Create New Item
                      </Button>
                    </DialogLink>
                  </Grid2>
                </Grid2>
                <CheckInOutForm
                  kioskMode={kioskMode.enabled}
                  users={users}
                  itemDefinitions={itemDefinitions}
                  categories={categories}
                  formData={formData}
                  setFormData={setFormData}
                  inventoryItem={inventoryItem}
                  itemDefinition={defaultItemDef}
                  errors={errors}
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
          redirectBack={async (router, itemId?) => {
            if (itemId)
              await router.push(`${urls.pages.checkIn}?item=${itemId}`)
            else await router.push(urls.pages.checkIn)
          }}
        />
      </RoutableDialog>
    </>
  )
}
