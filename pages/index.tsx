import Head from 'next/head'
import Image from 'next/image'
import InventoryItemListItem from 'components/InventoryItemListItem'
import { InventoryItem, ItemDefinition } from 'utils/types'
import { Table, TableBody, TableContainer } from '@mui/material'

export default function Home() {
  const itemDefinitionTest: ItemDefinition = {
    name: 'test item',
    internal: true,
    category: 'shirt',
    lowStockThreshold: 15,
    criticalStockThreshold: 5,
  }

  const testItem: InventoryItem = {
    itemDefinition: itemDefinitionTest,
    attributes: [
      { attribute: 'sleeve', value: 'long-sleeve' },
      { attribute: 'size', value: 'medium' },
      { attribute: 'color', value: 'black' },
    ],
    quantity: 4,
    assignee: 'Rudra Patel',
  }

  return (
    <TableContainer sx={{ maxWidth: '80%', marginInline: 'auto' }}>
      <Table>
        <TableBody>
          <InventoryItemListItem inventoryItem={testItem} />
        </TableBody>
      </Table>
    </TableContainer>
  )
}
