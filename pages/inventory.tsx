import InventoryItemList from 'components/InventoryItemList'
import { InventoryItemResponse } from 'utils/types'
import { createRequest, createResponse, Headers } from 'node-mocks-http'
import inventoryItemsHandler from 'pages/api/inventoryItems'
import { Typography } from '@mui/material'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res = createResponse()
  await inventoryItemsHandler(context.req as NextApiRequest, res)
  const responseData: InventoryItemResponse[] = res._getJSONData().payload
  return {
    props: { inventoryItems: responseData },
  }
}
interface Props {
  inventoryItems: InventoryItemResponse[]
}

export default function InventoryPage({ inventoryItems }: Props) {
  return (
    <>
      <InventoryItemList
        inventoryItems={inventoryItems}
        search={''}
        category={''}
      />
    </>
  )
}
