import {
  Box,
  Typography,
  Button,
  Unstable_Grid2 as Grid2,
  useMediaQuery,
  Autocomplete,
  TextField,
  Checkbox,
  useTheme,
} from '@mui/material'
import SearchField from 'components/SearchField'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import { CategoryResponse, LogResponse } from 'utils/types'
import { NextRouter, useRouter } from 'next/router'
import categoriesHandler from '@api/categories'
import { DatePicker } from '@mui/x-date-pickers'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import { addURLQueryParam, removeURLQueryParam } from 'utils/queryParams'
import SearchAutocomplete from 'components/SearchAutocomplete'
import DesktopHistoryList from 'components/DesktopHistoryList'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { categories: await apiWrapper(categoriesHandler, context) },
  }
}

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

interface HistoryPageProps {
  logs: LogResponse[]
  categories: CategoryResponse[]
}

const updateQuery = (router: NextRouter, key: string, val?: string) => {
  if (!val) removeURLQueryParam(router, key)
  else addURLQueryParam(router, key, val)
}

const renderInternalCheckbox = (router: NextRouter, isMobileView: boolean) => {
  return (
    <Grid2
      container
      md={2}
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: `${isMobileView ? 'center' : 'normal'}`,
      }}
    >
      <Checkbox
        onChange={(_e, checked) => {
          if (checked) updateQuery(router, 'internal', 'true')
          else updateQuery(router, 'internal', undefined)
        }}
        value={router.query.internal}
      />
      <Typography>Internal only</Typography>
    </Grid2>
  )
}

export default function HistoryPage({ logs, categories }: HistoryPageProps) {
  const router = useRouter()
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Grid2 container my={2} sx={{ flexGrow: 1 }} gap={2}>
      {/* Header -- "History" and "Export To Excel" button*/}
      <Grid2 xs={12} container direction={'row'}>
        <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
          History
        </Typography>
        {!isMobileView && (
          <Grid2 ml="auto" mr={6}>
            <Button variant="outlined" sx={{ width: '100%' }}>
              Export To Excel
            </Button>
          </Grid2>
        )}
      </Grid2>

      {/* Filter views -- search, category dropdown, date range, internal only checkbox */}
      <Grid2
        container
        xs={12}
        direction={isMobileView ? 'column' : 'row'}
        gap={isMobileView ? 2 : 4}
        sx={{ px: 2, alignItems: 'center' }}
      >
        <Grid2 xs={12} md={2}>
          <SearchField />
        </Grid2>
        <Grid2
          xs={12}
          md={2}
          container
          direction="row"
          sx={{ alignItems: 'center' }}
        >
          <Grid2 xs={isMobileView ? 6 : 12}>
            <SearchAutocomplete
              searchKey="category"
              options={categories.map((category) => category.name)}
              placeholder="Category"
            ></SearchAutocomplete>
          </Grid2>
          {isMobileView && (
            <Grid2 xs={6}>{renderInternalCheckbox(router, isMobileView)}</Grid2>
          )}
        </Grid2>
        <Grid2 xs={12} md={4} direction="row">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <DatePicker
              label="Start Date"
              renderInput={(params) => <TextField {...params} fullWidth />}
              onChange={(date) => {
                const startDate = new Date(date as string)
                updateQuery(
                  router,
                  'startDate',
                  startDate.toISOString().split('T')[0]
                )
              }}
              value={router.query.startDate || null}
            />
            <Box ml={1} mr={1}>
              <HorizontalRuleIcon sx={{ color: theme.palette.grey['500'] }} />
            </Box>
            <DatePicker
              label="End Date"
              renderInput={(params) => <TextField {...params} fullWidth />}
              onChange={(date) => {
                const endDate = new Date(date as string)
                updateQuery(
                  router,
                  'endDate',
                  endDate.toISOString().split('T')[0]
                )
              }}
              value={router.query.endDate || null}
            />
          </Box>
        </Grid2>
        {!isMobileView && renderInternalCheckbox(router, isMobileView)}
      </Grid2>
      <DesktopHistoryList
        logs={testData}
        search={''}
        category={''}
        endDate={new Date()}
        startDate={new Date()}
        internal={false}
      />
    </Grid2>
  )
}
