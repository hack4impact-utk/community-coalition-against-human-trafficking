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
import { getInventoryItemsApi } from 'utils/apiWrappers'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { inventoryItems: await getInventoryItemsApi(context) },
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
