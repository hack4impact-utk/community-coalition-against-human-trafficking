import { Box } from '@mui/material'
import InventoryItemList from 'components/InventoryItemList'

export default function InventoryPage() {
  return (
    <Box>
      <InventoryItemList inventoryItems={[]} search={''} category={''} />
    </Box>
  )
}
