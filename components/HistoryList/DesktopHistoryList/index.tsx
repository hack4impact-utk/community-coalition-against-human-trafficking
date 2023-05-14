import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import { CategoryResponse, LogResponse } from 'utils/types'
import HistoryListItem from './DesktopHistoryListItem'
import { NextRouter, useRouter } from 'next/router'
import {
  removeURLQueryParam,
  addURLQueryParam,
  bulkAddURLQueryParams,
} from 'utils/queryParams'
import { LinearProgress, TableCell } from '@mui/material'
import { historyPaginationDefaults } from 'utils/constants'
import NoResultsRow from 'components/NoResultsRow'

type Order = 'asc' | 'desc'

interface HistoryTableData extends LogResponse {
  kebab: string
  category: string | CategoryResponse
}

interface HeadCell {
  disablePadding: boolean
  id: keyof HistoryTableData
  label: string
  numeric: boolean
  sortable?: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'staff',
    numeric: false,
    disablePadding: true,
    label: 'Staff',
    sortable: true,
  },
  {
    id: 'item',
    numeric: false,
    disablePadding: false,
    label: 'Item',
    sortable: true,
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
    sortable: true,
  },
  {
    id: 'quantityDelta',
    numeric: false,
    disablePadding: false,
    label: 'Quantity',
    sortable: true,
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
    sortable: true,
  },
  {
    id: 'kebab',
    numeric: false,
    disablePadding: false,
    label: '',
    sortable: false,
  },
]

interface EnhancedTableProps {
  order: Order
  orderBy: string
  router: NextRouter
}

function HistoryListHeader(props: EnhancedTableProps) {
  const { order, orderBy, router } = props
  const createSortHandler = (property: keyof HistoryTableData) => async () => {
    const orderBy = router.query.orderBy
    const order = router.query.order
    const isAsc = orderBy === property && order === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'
    await bulkAddURLQueryParams(router, {
      order: newOrder,
      orderBy: property,
    })
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sx={{ fontWeight: 'bold' }}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface Props {
  logs: LogResponse[]
  search: string
  category: string
  endDate: string
  startDate: string
  internal: boolean
  setTableData: React.Dispatch<React.SetStateAction<LogResponse[]>>
  total: number
  loading: boolean
}

const updateQuery = async (router: NextRouter, key: string, val?: string) => {
  if (!val) await removeURLQueryParam(router, key)
  else await addURLQueryParam(router, key, val)
}

export default function DesktopHistoryList(props: Props) {
  const router = useRouter()

  // when the change page buttons are clicked
  const handleChangePage = (_e: unknown, newPage: number) => {
    if (newPage === historyPaginationDefaults.page) {
      removeURLQueryParam(router, 'page')
    } else {
      updateQuery(router, 'page', newPage.toString())
    }
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    removeURLQueryParam(router, 'page')
    if (Number(event.target.value) === historyPaginationDefaults.limit) {
      removeURLQueryParam(router, 'limit')
    } else {
      updateQuery(router, 'limit', event.target.value)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      {props.loading && (
        <LinearProgress
          variant="indeterminate"
          sx={{
            height: 3,
          }}
        />
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={props.total}
        rowsPerPage={Number(
          router.query.limit || historyPaginationDefaults.limit.toString()
        )}
        page={Number(
          router.query.page || historyPaginationDefaults.page.toString()
        )}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          size="medium"
          sx={{ mt: props.loading ? '0' : '3px' }} // lets us have the page not shift when loading
        >
          <HistoryListHeader
            order={router.query.order as Order}
            orderBy={router.query.orderBy as string}
            router={router}
          />
          <TableBody>
            {!!props.logs.length &&
              props.logs.map((log) => (
                <HistoryListItem log={log} key={log._id} />
              ))}
            {!props.logs.length && <NoResultsRow numCols={6} />}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
