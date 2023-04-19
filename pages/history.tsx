import attributesHandler from '@api/attributes'
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
import AttributeList from 'components/AttributeList'
import SearchField from 'components/SearchField'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import { AttributeResponse, CategoryResponse, LogResponse } from 'utils/types'
import AddIcon from '@mui/icons-material/Add'
import { NextRouter, useRouter } from 'next/router'
import theme from 'utils/theme'
import categoriesHandler from '@api/categories'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import { addURLQueryParam, removeURLQueryParam } from 'utils/queryParams'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { categories: await apiWrapper(categoriesHandler, context) },
  }
}

interface HistoryPageProps {
  logs: LogResponse[]
  categories: CategoryResponse[]
}

const updateQuery = (router: NextRouter, key: string, val?: string) => {
  if (!val) removeURLQueryParam(router, key)
  else addURLQueryParam(router, key, val)
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
        direction={isMobileView ? 'column-reverse' : 'row'}
        gap={isMobileView ? 2 : 4}
        sx={{ px: 2, alignItems: 'center' }}
      >
        <Grid2 xs={12} md={2}>
          <SearchField />
        </Grid2>
        <Grid2 xs={12} md={2}>
          <Autocomplete
            value={
              categories.filter(
                (category) =>
                  category.name === (router.query.category as string)
              )[0]
            }
            options={categories}
            renderInput={(params) => <TextField {...params} label="Category" />}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            getOptionLabel={(category) => category.name}
            onChange={(_e, category) => {
              updateQuery(router, 'category', category?.name)
            }}
          />
        </Grid2>
        <Grid2 xs={12} md={4} direction="row">
          <Box
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
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
              <HorizontalRuleIcon />
            </Box>
            <DatePicker
              label="End Date"
              renderInput={(params) => <TextField {...params} fullWidth />}
              onChange={(_e, date) => {
                const endDate = new Date(_e as string)
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

        <Grid2 container md={2} direction="row" sx={{ alignItems: 'center' }}>
          <Checkbox
            onChange={(_e, checked) => {
              if (checked) updateQuery(router, 'internal', 'true')
              else updateQuery(router, 'internal', undefined)
            }}
            value={router.query.internal}
          />
          <Typography>Internal only</Typography>
        </Grid2>
      </Grid2>
    </Grid2>
  )
}
