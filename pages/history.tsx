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
import React from 'react'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      categories: await apiWrapper(categoriesHandler, context),
    },
  }
}

interface HistoryPageProps {
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
        checked={router.query.internal === 'true' ? true : false}
      />
      <Typography>Internal only</Typography>
    </Grid2>
  )
}

const constructQueryString = (params: { [key: string]: string }) => {
  if (Object.keys(params).length === 0) return ''
  return `?${Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`
}

export default function HistoryPage({ categories }: HistoryPageProps) {
  const [tableData, setTableData] = React.useState<LogResponse[]>([])
  const [totalLogs, setTotalLogs] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [search, setSearch] = React.useState<string>('')
  const [category, setCategory] = React.useState<string>('')

  const router = useRouter()
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))

  const handleExport = () => {
    const requestStr = `http://localhost:3000/api/logs/export${constructQueryString(
      router.query as { [key: string]: string }
    )}`

    fetch(requestStr, {
      method: 'GET',
    }).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Warehouse History ${new Date()
          .toISOString()
          .slice(0, 10)}`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
    })
  }

  React.useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      if (router.query.search !== search) {
        updateQuery(router, 'page', '')
        setSearch(router.query.search as string)
      }
      if (router.query.category !== category) {
        updateQuery(router, 'page', '')
        setCategory(router.query.category as string)
      }

      const response = await fetch(
        `http://localhost:3000/api/logs${constructQueryString(
          router.query as { [key: string]: string }
        )}`,
        {
          method: 'GET',
        }
      )
      const { payload } = await response.json()
      setTableData(payload.data)
      setTotalLogs(payload.total)
      setLoading(false)
    }
    fetchLogs()
  }, [
    router.query.page,
    router.query.limit,
    router.query.search,
    router.query.category,
    router.query.startDate,
    router.query.endDate,
    router.query.internal,
    router.query.sort,
    router.query.order,
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
              onClick={() => handleExport()}
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
          total={totalLogs}
          loading={loading}
        />
      )}
    </Grid2>
  )
}
