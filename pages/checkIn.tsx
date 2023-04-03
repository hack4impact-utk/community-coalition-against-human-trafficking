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
  InventoryItemAttributeRequest,
  InventoryItemRequest,
  ItemDefinitionResponse,
} from 'utils/types'
import { createResponse } from 'node-mocks-http'
import categoriesHandler from '@api/categories'
import { GetServerSidePropsContext, NextApiRequest } from 'next'
import React from 'react'
import itemDefinitionsHandler from '@api/itemDefinitions'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const categoryRes = createResponse()
  await categoriesHandler(context.req as NextApiRequest, categoryRes)
  const categoryResData: CategoryResponse[] = categoryRes._getJSONData().payload

  const itemDefinitionRes = createResponse()
  await itemDefinitionsHandler(context.req as NextApiRequest, itemDefinitionRes)
  const itemDefinitionResData: ItemDefinitionResponse[] =
    itemDefinitionRes._getJSONData().payload

  return {
    props: {
      categories: categoryResData,
      itemDefinitions: itemDefinitionResData,
    },
  }
}
interface Props {
  categories: CategoryResponse[]
  itemDefinitions: ItemDefinitionResponse[]
}

export default function CheckInPage({ categories, itemDefinitions }: Props) {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'))

  const [formData, setFormData] = React.useState<CheckInOutFormData>(
    {} as CheckInOutFormData
  )

  const onSubmit = async (formData: CheckInOutFormData) => {
    const inventoryItem: Partial<InventoryItemRequest> = {
      itemDefinition: formData.itemDefinition._id,
      attributes: formData.attributes.map(
        (attributeOption): InventoryItemAttributeRequest => ({
          attribute: attributeOption.id,
          value: attributeOption.value,
        })
      ),
      assignee: formData.user?._id,
    }

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
                itemDefinitions={itemDefinitions}
                categories={categories}
                formData={formData}
                setFormData={setFormData}
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
