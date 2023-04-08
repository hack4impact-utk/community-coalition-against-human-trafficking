import InventoryItemList from 'components/InventoryItemList'
import { InventoryItemResponse } from 'utils/types'
import inventoryItemsHandler from 'pages/api/inventoryItems'
import { GetServerSidePropsContext } from 'next'
import InventoryItemListItemKebab from 'components/InventoryItemListItemKebab'
import { apiWrapper } from 'utils/apiWrappers'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { inventoryItems: await apiWrapper(inventoryItemsHandler, context) },
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
      <InventoryItemListItemKebab inventoryItem={inventoryItems[0]} />
    </>
  )
}
