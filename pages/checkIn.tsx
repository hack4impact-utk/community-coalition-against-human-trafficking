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
  InventoryItemRequest,
  ItemDefinitionResponse,
  UserResponse,
} from 'utils/types'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { checkInOutFormDataToInventoryItemRequest } from 'utils/transformations'
import { apiWrapper } from 'utils/apiWrappers'
import usersHandler from '@api/users'
import itemDefinitionsHandler from '@api/itemDefinitions'
import categoriesHandler from '@api/categories'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useAppSelector } from 'store'
import DialogLink from 'components/DialogLink'
import { KioskState } from 'store/types'

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
  const inventoryItem = !!router.query.inventoryItem
    ? JSON.parse(decodeURIComponent(router.query.inventoryItem as string))
    : undefined
  const [defaultItemDef, setDefaultItemDef] = React.useState(itemDefinitions.find((id) => id._id === router.query.item))
  const kioskMode = useAppSelector(
    (state: { kiosk: KioskState }) => state.kiosk
  )

  React.useEffect(() => {
    setDefaultItemDef(itemDefinitions.find((id) => id._id === router.query.item))
  }, [router.query.item, itemDefinitions])

  const [formData, setFormData] = React.useState<CheckInOutFormData>(
    {} as CheckInOutFormData
  )

  const onSubmit = async (formData: CheckInOutFormData) => {
    const inventoryItem: Partial<InventoryItemRequest> =
      checkInOutFormDataToInventoryItemRequest(formData)

    // TODO better way of coding URLs
    await fetch(
      `http://localhost:3000/api/inventoryItems/checkIn?quantity=${formData.quantityDelta}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventoryItem),
      }
    )
    setFormData((formData) => {
      return {
        user: formData.user,
        date: dayjs(new Date()),
        quantityDelta: 0,
      } as CheckInOutFormData
    })
  }

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
        <DialogLink href="/items/new" backHref='/checkIn'>
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
              <Button onClick={() => onSubmit(formData)} variant="contained">
                Check in
              </Button>
            </CardActions>
          </Box>
        </Card>
      </Grid2>
    </Grid2>
  )
}
