import {
  Box,
  Typography,
  Button,
  Unstable_Grid2 as Grid2,
  useMediaQuery,
  TextField,
  Checkbox,
  useTheme,
  IconButton,
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
import DesktopHistoryList from 'components/HistoryList/DesktopHistoryList'
import MobileHistoryList from 'components/HistoryList/MobileHistoryList'
import { Clear } from '@mui/icons-material'
import LogsHandler from '@api/logs'
import React from 'react'
import deepCopy from 'utils/deepCopy'
import { dateToReadableDateString } from 'utils/transformations'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      categories: await apiWrapper(categoriesHandler, context),
      logs: await apiWrapper(LogsHandler, context),
    },
  }
}

interface HistoryPageProps {
  logs: LogResponse[]
  categories: CategoryResponse[]
}

interface CsvRow {
  Item: string
  Attributes: string
  Category: string
  Quantity: number
  Staff: string
  Date: string
}

function handleExport(logs: LogResponse[]) {
  const csvString = createLogsCsvAsString(logs)
  const file: Blob = new Blob([csvString], { type: 'text/csv' })

  // to download the file, create an <a> tag, associate the file with it, and click it
  const a = document.createElement('a')
  a.href = URL.createObjectURL(file)

  // set file name. .slice() to put date in in yyyy-mm-dd format
  a.download = `Warehouse History ${new Date().toISOString().slice(0, 10)}`
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function createLogsCsvAsString(logs: LogResponse[]) {
  /* Creates CSV-formatted string by:
   * 1. Create the header row
   * 2. creating a CsvRow obj
   * 3. converted obj to string by separating the object values by with a comma
   * 4. creating an array of CsvRow obj converted strings
   * 5. joining each array element with a newline
   */
  const csvKeys: (keyof CsvRow)[] = [
    'Item',
    'Attributes',
    'Category',
    'Quantity',
    'Staff',
    'Date',
  ]

  const csvKeysString: string = csvKeys.join(',')

  const csvData: CsvRow[] = logs.map((log) => {
    const csvRow: CsvRow = {
      Item: log.item.itemDefinition.name,
      Attributes:
        log.item.attributes
          ?.map((attr) => `${attr.attribute.name}: ${attr.value}`)
          .join('; ') ?? '',
      Category: log.item.itemDefinition.category?.name ?? '',
      Quantity: log.quantityDelta,
      Staff: log.staff.name,
      Date: new Date(log.date).toISOString(),
    }
    return csvRow
  })

  // sort rows by date
  const compareFn = (d1: Date, d2: Date) => {
    if (d1 < d2) {
      return -1
    }

    if (d1 > d2) {
      return 1
    }

    return 0
  }

  csvData.sort((row1: CsvRow, row2: CsvRow) =>
    compareFn(new Date(row2.Date), new Date(row1.Date))
  )

  const csvDataString: string = csvData
    .map((data) => Object.values(data).join(','))
    .join('\n')

  return `${csvKeysString}\n${csvDataString}`
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
        checked={router.query.internal === 'true' ? true : false}
      />
      <Typography>Internal only</Typography>
    </Grid2>
  )
}

export default function HistoryPage({ logs, categories }: HistoryPageProps) {
  const [tableData, setTableData] = React.useState<LogResponse[]>(logs)
  const router = useRouter()
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))

  React.useEffect(() => {
    let newTableData: LogResponse[] = deepCopy(logs)

    if (router.query.internal) {
      newTableData = newTableData.filter(
        (log) => log.item.itemDefinition.internal
      )
    }

    if (router.query.search) {
      const search = (router.query.search as string).toLowerCase()
      newTableData = newTableData.filter((log) => {
        return (
          log.staff.name.toLowerCase().includes(search) ||
          log.item.itemDefinition.name.toLowerCase().includes(search) ||
          (log.item.attributes &&
            log.item.attributes
              .map((attr) =>
                `${attr.attribute.name}: ${attr.value}`.toLowerCase()
              )
              .join(' ')
              .includes(search)) ||
          (log.item.itemDefinition.category &&
            log.item.itemDefinition.category.name
              .toLowerCase()
              .includes(search)) ||
          log.quantityDelta.toString().toLowerCase().includes(search) ||
          dateToReadableDateString(log.date).toLowerCase().includes(search)
        )
      })
    }

    const startDate = router.query.startDate
      ? new Date(router.query.startDate as string).getTime()
      : undefined
    const endDate = router.query.endDate
      ? new Date(router.query.endDate as string).getTime()
      : undefined

    if (router.query.startDate && router.query.endDate) {
      newTableData = newTableData.filter(
        (log) =>
          new Date(log.date).getTime() >= startDate! &&
          new Date(log.date).getTime() <= endDate!
      )
    } else if (router.query.startDate) {
      newTableData = newTableData.filter(
        (log) => new Date(log.date).getTime() >= startDate!
      )
    } else if (router.query.endDate) {
      newTableData = newTableData.filter(
        (log) => new Date(log.date).getTime() <= endDate!
      )
    }

    if (router.query.startDate || router.query.endDate) {
      // if props.startDate or props.endDate are not present, use an arbitrarily far-away date
      const startDate = new Date(
        (router.query.startDate as string) ?? '1000-01-01'
      ).getTime()
      const endDate = new Date(
        (router.query.endDate as string) ?? '9999-01-01'
      ).getTime()
      newTableData = newTableData.filter((log) => {
        return (
          new Date(log.date).getTime() >= startDate &&
          new Date(log.date).getTime() <= endDate
        )
      })
    }

    if (router.query.category) {
      newTableData = newTableData.filter((log) => {
        return log.item.itemDefinition.category?.name === router.query.category
      })
    }
    setTableData(newTableData)
  }, [
    router.query.search,
    router.query.category,
    router.query.startDate,
    router.query.endDate,
    router.query.internal,
  ])

  return (
    <Grid2 container my={2} sx={{ flexGrow: 1 }} gap={2}>
      {/* Header -- "History" and "Export To Excel" button*/}
      <Grid2 xs={12} container direction={'row'}>
        <Typography variant="h5" sx={{ mb: 2, ml: 2 }}>
          History
        </Typography>
        {!isMobileView && (
          <Grid2 ml="auto" mr={6}>
            <Button
              variant="outlined"
              sx={{ width: '100%' }}
              onClick={() => handleExport(tableData)}
            >
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
              renderInput={(params) => (
                <Box
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '100%',
                  }}
                >
                  <TextField
                    {...params}
                    label="Start Date"
                    variant="outlined"
                    fullWidth
                  />
                  {router.query.startDate && (
                    <IconButton
                      style={{
                        position: 'absolute',
                        top: '.5rem',
                        margin: 'auto',
                        right: !isMobileView ? '2rem' : '0.5rem',
                      }}
                      onClick={() => removeURLQueryParam(router, 'startDate')}
                    >
                      <Clear />
                    </IconButton>
                  )}
                </Box>
              )}
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
              renderInput={(params) => (
                <Box
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '100%',
                  }}
                >
                  <TextField
                    {...params}
                    label="End Date"
                    variant="outlined"
                    fullWidth
                  />
                  {router.query.endDate && (
                    <IconButton
                      style={{
                        position: 'absolute',
                        top: '.5rem',
                        margin: 'auto',
                        right: !isMobileView ? '2rem' : '0.5rem',
                      }}
                      onClick={() => removeURLQueryParam(router, 'endDate')}
                    >
                      <Clear />
                    </IconButton>
                  )}
                </Box>
              )}
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
      {isMobileView ? (
        <MobileHistoryList
          logs={tableData}
          search={router.query.search as string}
          category={router.query.category as string}
          endDate={router.query.endDate as string}
          startDate={router.query.startDate as string}
          internal={!!router.query.internal}
          setTableData={setTableData}
        />
      ) : (
        <DesktopHistoryList
          logs={tableData}
          search={router.query.search as string}
          category={router.query.category as string}
          endDate={router.query.endDate as string}
          startDate={router.query.startDate as string}
          internal={!!router.query.internal}
          setTableData={setTableData}
        />
      )}
    </Grid2>
  )
}
