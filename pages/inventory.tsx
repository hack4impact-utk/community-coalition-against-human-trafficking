import InventoryItemList from 'components/InventoryItemList'
import { InventoryItem, InventoryItemResponse } from 'utils/types'
import { createRequest, createResponse } from 'node-mocks-http'
import handler from 'pages/api/inventoryItems'

export async function getServerSideProps() {
  const request = createRequest({
    method: 'GET',
    url: `api/inventoryItems`,
  })
  const response = createResponse()
  const res = await handler(request, response)
  return {
    props: {},
  }
}
interface Props {
  inventoryItems: InventoryItemResponse[]
}

export default function InventoryPage({ inventoryItems }: Props) {
  return (
    <>
      {inventoryItems != null && (
        <InventoryItemList
          inventoryItems={inventoryItems}
          search={''}
          category={''}
        />
      )}
    </>
  )
}
