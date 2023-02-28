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
      { attribute: 'sleeve', value: 'long-sleeve' },
      { attribute: 'size', value: 'medium' },
      { attribute: 'color', value: 'black' },
    ],
    quantity: 4,
    assignee: 'Rudra Patel',
  }

  const testItem2: InventoryItem = {
    itemDefinition: itemDefinitionTest,
    attributes: [
      { attribute: 'sleeve', value: 'long-sleeve' },
      { attribute: 'size', value: 'medium' },
      { attribute: 'color', value: 'black' },
      { attribute: 'sleeve', value: 'long-sleeve' },
      { attribute: 'size', value: 'medium' },
      { attribute: 'color', value: 'black' },
    ],
    quantity: 250000,
    assignee: 'Rudra Patel',
  }

  const testItem3: InventoryItem = {
    itemDefinition: itemDefinitionTest,
    attributes: [
      {
        attribute: {
          name: 'testAttribute',
          possibleValues: ['test1', 'test2'],
          color: '#FF0000',
        },
        value: 'testValue',
      },
      {
        attribute: {
          name: 'testAttribute2',
          possibleValues: 'number',
          color: '#00FF00',
        },
        value: 'testValue',
      },
      {
        attribute: {
          name: 'testAttribute3',
          possibleValues: 'text',
          color: '#0000FF',
        },
        value: 'testValue',
      },
    ],
    quantity: 7,
    assignee: 'Andrew',
  }

  return (
    <TableContainer sx={{ maxWidth: '80%', marginInline: 'auto' }}>
      <Table>
        <TableBody>
          <InventoryItemListItem inventoryItem={testItem} />
          <InventoryItemListItem inventoryItem={testItem2} />
          <InventoryItemListItem inventoryItem={testItem3} />
        </TableBody>
      </Table>
    </TableContainer>
  )
}
