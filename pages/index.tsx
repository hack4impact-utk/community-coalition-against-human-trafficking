import { Button } from '@mui/material'
import DesktopHistoryListItem from 'components/DesktopHistoryList/DesktopHistoryListItem'
import DialogLink from 'components/DialogLink'
import { LogResponse } from 'utils/types'

const testData: LogResponse = {
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
}

export default function DashboardPage() {
  return <DesktopHistoryListItem log={testData} />
}
