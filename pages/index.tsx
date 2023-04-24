import { Button } from '@mui/material'
import DesktopHistoryList from 'components/HistoryList/DesktopHistoryList'
import DesktopHistoryListItem from 'components/HistoryList/DesktopHistoryList/DesktopHistoryListItem'
import DialogLink from 'components/DialogLink'
import { LogResponse } from 'utils/types'

// this test data is sponsored by chatgpt
const testData: LogResponse[] = [
  {
    _id: '643cbb7bb2e624416a1dee44',

    staff: {
      _id: '63f95a8a55d930aa6176f06b',
      name: 'Andrew Rutter',
      email: 'andrewrules.rutter@gmail.com',
      image:
        'https://lh3.googleusercontent.com/a/AGNmyxax1wXEfj2xEQpfs0BR87d2cmvj1VrI1-h7l_ut=s96-c',
    },
    item: {
      _id: '643cbb7bb2e624416a1dedd1',
      itemDefinition: {
        _id: '643cbb7bb2e624416a1dedb1',
        name: 'Shirt',
        category: {
          _id: '643cbb7bb2e624416a1ded9a',
          name: 'Clothing',
        },
        attributes: [
          {
            _id: '643cbb7bb2e624416a1deda2',
            name: 'Top Size',
            possibleValues: ['Small', 'Medium', 'Large', 'Extra-Large'],
            color: '#ebebeb',
          },
          {
            _id: '643cbb7bb2e624416a1deda3',
            name: 'Shirt Type',
            possibleValues: ['Short-Sleeve', 'Long-Sleeve'],
            color: '#c7dbda',
          },
        ],
        internal: false,
        lowStockThreshold: 20,
        criticalStockThreshold: 10,
      },
      attributes: [
        {
          attribute: {
            _id: '643cbb7bb2e624416a1deda2',
            name: 'Top Size',
            possibleValues: ['Small', 'Medium', 'Large', 'Extra-Large'],
            color: '#ebebeb',
          },
          value: 'Small',
        },
        {
          attribute: {
            _id: '643cbb7bb2e624416a1deda3',
            name: 'Shirt Type',
            possibleValues: ['Short-Sleeve', 'Long-Sleeve'],
            color: '#c7dbda',
          },
          value: 'Short-Sleeve',
        },
      ],
      quantity: 23,
    },
    quantityDelta: 5,
    date: new Date('2022-02-10T14:47:12.419Z'),
  },
  {
    _id: '743cbb7bb2e624416a1dee44',
    staff: {
      _id: '73f95a8a55d930aa6176f06b',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      image:
        'https://lh3.googleusercontent.com/a/AGNmyxax1wXEfj2xEQpfs0BR87d2cmvj1VrI1-h7l_ut=s96-c',
    },
    item: {
      _id: '743cbb7bb2e624416a1dedd1',
      itemDefinition: {
        _id: '743cbb7bb2e624416a1dedb1',
        name: 'Jeans',
        category: {
          _id: '743cbb7bb2e624416a1ded9a',
          name: 'Clothing',
        },
        attributes: [
          {
            _id: '743cbb7bb2e624416a1deda2',
            name: 'Waist Size',
            possibleValues: 'number',
            color: '#ebebeb',
          },
          {
            _id: '743cbb7bb2e624416a1deda3',
            name: 'Length',
            possibleValues: ['Short', 'Regular', 'Long'],
            color: '#c7dbda',
          },
        ],
        internal: false,
        lowStockThreshold: 15,
        criticalStockThreshold: 5,
      },
      attributes: [
        {
          attribute: {
            _id: '743cbb7bb2e624416a1deda2',
            name: 'Waist Size',
            possibleValues: 'number',
            color: '#ebebeb',
          },
          value: '32',
        },
        {
          attribute: {
            _id: '743cbb7bb2e624416a1deda3',
            name: 'Length',
            possibleValues: ['Short', 'Regular', 'Long'],
            color: '#c7dbda',
          },
          value: 'Long',
        },
      ],
      quantity: 17,
    },
    quantityDelta: 3,
    date: new Date('2022-05-12T10:30:42.419Z'),
  },
  {
    _id: '843cbb7bb2e624416a1dee44',
    staff: {
      _id: '83f95a8a55d930aa6176f06b',
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      image:
        'https://lh3.googleusercontent.com/a/AGNmyxax1wXEfj2xEQpfs0BR87d2cmvj1VrI1-h7l_ut=s96-c',
    },
    item: {
      _id: '843cbb7bb2e624416a1dedd1',
      itemDefinition: {
        _id: '843cbb7bb2e624416a1dedb1',
        name: 'Sneakers',
        category: {
          _id: '843cbb7bb2e624416a1ded9a',
          name: 'Footwear',
        },
        attributes: [
          {
            _id: '843cbb7bb2e624416a1deda2',
            name: 'Shoe Size',
            possibleValues: ['6', '7', '8', '9'],
            color: '#ebebeb',
          },
          {
            _id: '843cbb7bb2e624416a1deda3',
            name: 'Color',
            possibleValues: ['Black', 'White', 'Red'],
            color: '#c7dbda',
          },
        ],
        internal: false,
        lowStockThreshold: 25,
        criticalStockThreshold: 15,
      },
      attributes: [
        {
          attribute: {
            _id: '843cbb7bb2e624416a1deda2',
            name: 'Shoe Size',
            possibleValues: ['6', '7', '8', '9'],
            color: '#ebebeb',
          },
          value: '8',
        },
        {
          attribute: {
            _id: '843cbb7bb2e624416a1deda3',
            name: 'Color',
            possibleValues: ['Black', 'White', 'Red'],
            color: '#c7dbda',
          },
          value: 'Black',
        },
      ],
      quantity: 35,
    },
    quantityDelta: 8,
    date: new Date('2022-07-15T15:20:12.419Z'),
  },
  {
    _id: '943cbb7bb2e624416a1dee44',
    staff: {
      _id: '93f95a8a55d930aa6176f06b',
      name: 'Michael Smith',
      email: 'michaelsmith@gmail.com',
      image:
        'https://lh3.googleusercontent.com/a/AGNmyxax1wXEfj2xEQpfs0BR87d2cmvj1VrI1-h7l_ut=s96-c',
    },
    item: {
      _id: '943cbb7bb2e624416a1dedd1',
      itemDefinition: {
        _id: '943cbb7bb2e624416a1dedb1',
        name: 'Laptop',
        category: {
          _id: '943cbb7bb2e624416a1ded9a',
          name: 'Electronics',
        },
        attributes: [
          {
            _id: '943cbb7bb2e624416a1deda2',
            name: 'Brand',
            possibleValues: ['Apple', 'Dell', 'HP', 'Lenovo'],
            color: '#ebebeb',
          },
          {
            _id: '943cbb7bb2e624416a1deda3',
            name: 'Screen Size',
            possibleValues: 'text',
            color: '#c7dbda',
          },
        ],
        internal: false,
        lowStockThreshold: 20,
        criticalStockThreshold: 10,
      },
      attributes: [
        {
          attribute: {
            _id: '943cbb7bb2e624416a1deda2',
            name: 'Brand',
            possibleValues: ['Apple', 'Dell', 'HP', 'Lenovo'],
            color: '#ebebeb',
          },
          value: 'Dell',
        },
        {
          attribute: {
            _id: '943cbb7bb2e624416a1deda3',
            name: 'Screen Size',
            possibleValues: 'text',
            color: '#c7dbda',
          },
          value: '15"',
        },
      ],
      quantity: 30,
    },
    quantityDelta: 5,
    date: new Date('2022-08-20T11:45:12.419Z'),
  },
]

export default function DashboardPage() {
  return (
    <>
      <DesktopHistoryList
        logs={testData}
        search={''}
        category={''}
        endDate={new Date()}
        startDate={new Date()}
        internal={false}
      />
    </>
  )
}
