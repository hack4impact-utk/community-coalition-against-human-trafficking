import InventoryItemListItem from 'components/InventoryItemListItem'
import { InventoryItem, ItemDefinition } from 'utils/types'
import { Table, TableBody, TableContainer, Box, Paper } from '@mui/material'

export default function Home() {
  const itemDefinitionTest: ItemDefinition = {
    name: 'test item this is a test item that is very long',
    internal: true,
    category: 'shirtttttttttt',
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
    quantity: 24000,
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
          name: 'test2',
          possibleValues: 'number',
          color: '#00FF00',
        },
        value: 'testValue',
      },
      {
        attribute: {
          name: 'test3',
          possibleValues: 'text',
          color: '#0000FF',
        },
        value: 'testValue',
      },
    ],
    quantity: 7,
    assignee: 'Really Long Name',
  }

  const testItem4: InventoryItem = {
    itemDefinition: itemDefinitionTest,
    attributes: [
      {
        attribute: {
          name: 'testAttribute',
          possibleValues: ['test1', 'test2'],
          color: '#777777',
        },
        value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
      {
        attribute: {
          name: 'test2',
          possibleValues: 'number',
          color: '#000000',
        },
        value: 'testValue',
      },
      {
        attribute: {
          name: 'test3',
          possibleValues: 'text',
          color: '#0000FF',
        },
        value: 'testValue',
      },
    ],
    quantity: 24000000000000000000,
    assignee: 'Andrewwwwwwwwwwwwwwwwwwwwwwwww',
  }

  return (
    // MAKE SURE THAT WIDTH IS FIXED, THEN CHANGE IT AS SCREEN GROWS
    // SAME GOES FOR TABLE CELLS
    // USING PERCENTAGES CAUSES PROBELMSSSSSSSSSSSSSSSSSSSSSSSSSS
    <TableContainer
      component={Paper}
      sx={{ marginInline: 'auto', width: {xs: "300px", sm: "500px", md: "600px", lg: "900px", xl: "1000px"} }}
    >
      <Table sx={{ width: 'max-content' }}>
        <TableBody>
          <InventoryItemListItem inventoryItem={testItem} />
          <InventoryItemListItem inventoryItem={testItem2} />
          <InventoryItemListItem inventoryItem={testItem3} />
          <InventoryItemListItem inventoryItem={testItem4} />
        </TableBody>
      </Table>
    </TableContainer>
  )
}
