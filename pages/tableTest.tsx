import DesktopInventoryItemListItem from 'components/DesktopInventoryItemList/DesktopInventoryItemListItem'
import { InventoryItemResponse, ItemDefinitionResponse } from 'utils/types'
import { Table, TableBody, TableContainer, Paper } from '@mui/material'

export default function Home() {
  const itemDefinitionTest: ItemDefinitionResponse = {
    _id: 'testId',
    name: 'test item this is a test item that is very long',
    internal: true,
    category: { _id: 'testId', name: 'shirtttttttttt' },
    lowStockThreshold: 15,
    criticalStockThreshold: 5,
  }

  const testItem: InventoryItemResponse = {
    _id: 'testId',
    itemDefinition: itemDefinitionTest,
    attributes: [
      {
        attribute: {
          _id: 'testId',
          name: 'sleeve',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'long-sleeve',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'size',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'medium',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'color',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'black',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'sleeve',
          possibleValues: 'text',
          color: '#FFFF00',
        },
        value: 'long-sleeve',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'size',
          possibleValues: 'text',
          color: '#000000',
        },
        value: 'medium',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'color',
          possibleValues: 'text',
          color: '#123456',
        },
        value: 'black',
      },
    ],
    quantity: 4,
    assignee: {
      name: 'testName',
      email: 'testEmail@testemail.com',
      image: 'testImageURL',
    },
  }

  const testItem2: InventoryItemResponse = {
    _id: 'testId',
    itemDefinition: itemDefinitionTest,
    attributes: [
      {
        attribute: {
          _id: 'testId',
          name: 'sleeve',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'long-sleeve',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'size',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'medium',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'color',
          possibleValues: 'text',
          color: '# 3D3D3D',
        },
        value: 'black',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'sleeve',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'long-sleeve',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'size',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'medium',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'color',
          possibleValues: 'text',
          color: '# 3D3D3D',
        },
        value: 'black',
      },
    ],
    quantity: 24000,
    assignee: {
      name: 'testName',
      email: 'testEmail@testemail.com',
      image: 'testImageURL',
    },
  }

  const testItem3: InventoryItemResponse = {
    _id: 'testId',
    itemDefinition: itemDefinitionTest,
    attributes: [
      {
        attribute: {
          _id: 'testId',
          name: 'sleeve',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'long-sleeve',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'size',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'medium',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'color',
          possibleValues: 'text',
          color: '# 3D3D3D',
        },
        value: 'black',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'sleeve',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'long-sleeve',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'size',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'medium',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'color',
          possibleValues: 'text',
          color: '# 3D3D3D',
        },
        value: 'black',
      },
    ],
    quantity: 7,
    assignee: {
      name: 'testName',
      email: 'testEmail@testemail.com',
      image: 'testImageURL',
    },
  }

  const testItem4: InventoryItemResponse = {
    _id: 'testId',
    itemDefinition: itemDefinitionTest,
    attributes: [
      {
        attribute: {
          _id: 'testId',
          name: 'sleeve',
          possibleValues: ['long-sleeve', 'short-sleeve'],
          color: '#3D3D3D',
        },
        value: 'long-sleeve',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'size',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'medium',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'color',
          possibleValues: 'text',
          color: '# 3D3D3D',
        },
        value: 'black',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'sleeve',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'long-sleeve',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'size',
          possibleValues: 'text',
          color: '#3D3D3D',
        },
        value: 'medium',
      },
      {
        attribute: {
          _id: 'testId',
          name: 'color',
          possibleValues: 'text',
          color: '# 3D3D3D',
        },
        value: 'black',
      },
    ],
    quantity: 24000000000000000000,
    assignee: {
      name: 'testName',
      email: 'testEmail@testemail.com',
      image: 'testImageURL',
    },
  }

  return (
    // MAKE SURE THAT WIDTH IS FIXED, THEN CHANGE IT AS SCREEN GROWS
    // SAME GOES FOR TABLE CELLS
    // USING PERCENTAGES CAUSES PROBELMSSSSSSSSSSSSSSSSSSSSSSSSSS
    <TableContainer
      component={Paper}
      sx={{
        marginInline: 'auto',
        width: {
          xs: '300px',
          sm: '500px',
          md: '600px',
          lg: '900px',
          xl: '1000px',
        },
      }}
    >
      <Table sx={{ width: 'max-content' }}>
        <TableBody>
          <DesktopInventoryItemListItem inventoryItem={testItem} />
          <DesktopInventoryItemListItem inventoryItem={testItem2} />
          <DesktopInventoryItemListItem inventoryItem={testItem3} />
          <DesktopInventoryItemListItem inventoryItem={testItem4} />
        </TableBody>
      </Table>
    </TableContainer>
  )
}
