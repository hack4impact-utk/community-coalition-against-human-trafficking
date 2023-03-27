import InventoryItemListItem from 'components/InventoryItemListItem'
import { InventoryItem, ItemDefinition } from 'utils/types'
import { Table, TableBody, TableContainer, Box, Paper } from '@mui/material'
import InventoryItemList from 'components/InventoryItemList'

export default function Home() {
  return (
    <InventoryItemList
      inventoryItems={testInventoryItems}
      search={''}
      category={''}
    />
  )
}

export const testInventoryItems: InventoryItem[] = [
  {
    _id: '1',
    itemDefinition: {
      _id: '1',
      name: 'test item 3',
      category: {
        _id: '1',
        name: 'test category',
      } ,
      attributes: [
        {
          _id: '1',
          name: 'color',
          possibleValues: ['red', 'blue', 'green'],
          color: '#000000',
        },
        {
          _id: '2',
          name: 'size',
          possibleValues: ['small', 'medium', 'large'],
          color: '#0000FF',
        },
      ],
      internal: false,
      lowStockThreshold: 10,
      criticalStockThreshold: 5,
    },
    attributes: [
      {
        attribute: '1',
        value: 'red',
      },
      {
        attribute: '2',
        value: 'small',
      },
    ],
    quantity: 10,
    assignee: '1',
  },
  {
    _id: '2',
    itemDefinition: {
      _id: '2',
      name: 'test item 2',
      category: {
        _id: '1',
        name: 'test category',
      },
      attributes: [
        {
          _id: '1',
          name: 'color',
          possibleValues: ['red', 'blue', 'green'],
          color: '#000000',
        },
        {
          _id: '2',
          name: 'size',
          possibleValues: ['small', 'medium', 'large'],
          color: '#0000FF',
        },
      ],
      internal: false,
      lowStockThreshold: 10,
      criticalStockThreshold: 5,
    },
    attributes: [
      {
        attribute: '1',
        value: 'blue',
      },
      {
        attribute: '2',
        value: 'medium',
      },
    ],
    quantity: 20,
    assignee: '1',
  },
]
