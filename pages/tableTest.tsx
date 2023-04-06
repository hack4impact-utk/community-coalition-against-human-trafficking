import {
  InventoryItem,
  InventoryItemResponse,
  ItemDefinition,
} from 'utils/types'
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

export const testInventoryItems: InventoryItemResponse[] = [
  {
    _id: '1',
    itemDefinition: {
      _id: '1',
      name: 'test item 3',
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
        attribute: {
          _id: '1',
          name: 'color',
          possibleValues: ['red', 'blue', 'green'],
          color: '#000000',
        },
        value: 'red',
      },
      {
        attribute: {
          _id: '2',
          name: 'size',
          possibleValues: ['small', 'medium', 'large'],
          color: '#0000FF',
        },
        value: 'small',
      },
    ],
    quantity: 10,
    assignee: {
      name: 'Yaren',
      email: 'nobody@gmail.com',
      image: 'url.com',
    },
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
        attribute: {
          _id: '1',
          name: 'color',
          possibleValues: ['red', 'blue', 'green'],
          color: '#000000',
        },
        value: 'blue',
      },
      {
        attribute: {
          _id: '2',
          name: 'size',
          possibleValues: ['small', 'medium', 'large'],
          color: '#0000FF',
        },
        value: 'medium',
      },
    ],
    quantity: 20,
  },
]
