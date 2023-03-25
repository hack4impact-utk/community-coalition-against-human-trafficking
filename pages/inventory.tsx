import { Box } from '@mui/material'
import InventoryItemList from 'components/InventoryItemList'
import * as MongoDriver from 'server/actions/MongoDriver'
import InventoryItemSchema from 'server/models/InventoryItem'

export async function getServerSideProps() {
  const response = await fetch('http://localhost:3000/api/inventoryItems', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(response)
  return {
    props: {},
  }
}

export default function InventoryPage() {
  return (
    <Box>
      <InventoryItemList inventoryItems={[]} search={''} category={''} />
    </Box>
  )
}
