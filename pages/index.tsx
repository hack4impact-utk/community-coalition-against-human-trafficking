import MobileInventoryItemList from 'components/MobileInventoryItemList'
import { AttributePossibleValues } from 'utils/types'

const inventoryItems = [
  {
    _id: '1ii',
    itemDefinition: {
      _id: '1id',
      name: 'Item 1',
      category: {
        _id: '1c',
        name: 'Category 1',
      },
      internal: false,
      lowStockThreshold: 0,
      criticalStockThreshold: 0,
    },
    attributes: [
      {
        attribute: {
          _id: '1a',
          name: 'Attribute 1',
          possibleValues: ['Value 1', 'Value 2'],
          color: '#FF0000',
        },
        value: 'Value 1',
      },
      {
        attribute: {
          _id: '2a',
          name: 'Attribute 2',
          possibleValues: 'number' as AttributePossibleValues,
          color: '#00FF00',
        },
        value: 2,
      },
    ],
    quantity: 10,
    assignee: {
      _id: '1u',
      name: 'User 1',
      email: 'user@test.com',
      image: 'https://i.imgur.com/0s3pdnc.png',
    },
  },
  {
    _id: '2ii',
    itemDefinition: {
      _id: '1id',
      name: 'Item 1',
      category: {
        _id: '1c',
        name: 'Category 1',
      },
      internal: false,
      lowStockThreshold: 0,
      criticalStockThreshold: 0,
    },
    attributes: [
      {
        attribute: {
          _id: '1a',
          name: 'Attribute 1',
          possibleValues: ['Value 1', 'Value 2'],
          color: '#FF0000',
        },
        value: 'Value 2',
      },
      {
        attribute: {
          _id: '2a',
          name: 'Attribute 2',
          possibleValues: 'number' as AttributePossibleValues,
          color: '#00FF00',
        },
        value: 1,
      },
      {
        attribute: {
          _id: '3a',
          name: 'Attribute 3',
          possibleValues: ['Value 3', 'Value 4'],
          color: '#0000FF',
        },
        value: 'Value 3',
      },
      {
        attribute: {
          _id: '4a',
          name: 'Attribute 4',
          possibleValues: 'text' as AttributePossibleValues,
          color: '#000000',
        },
        value: 'Value 4',
      },
    ],
    quantity: 10,
    assignee: {
      _id: '1u',
      name: 'User 1',
      email: 'user@test.com',
      image: 'https://i.imgur.com/0s3pdnc.png',
    },
  },
  {
    _id: '3ii',
    itemDefinition: {
      _id: '2id',
      name: 'Item 2',
      category: {
        _id: '2c',
        name: 'Category 2',
      },
      internal: false,
      lowStockThreshold: 0,
      criticalStockThreshold: 0,
    },
    attributes: [
      {
        attribute: {
          _id: '3a',
          name: 'Attribute 3',
          possibleValues: ['Value 3', 'Value 4'],
          color: '#0000FF',
        },
        value: 'Value 3',
      },
    ],
    assignee: {
      _id: '1u',
      name: 'User 1',
      email: 'user@test.com',
      image: 'https://i.imgur.com/0s3pdnc.png',
    },
    quantity: 10,
  },
]

export default function DashboardPage() {
  return <MobileInventoryItemList inventoryItems={inventoryItems} />
}
