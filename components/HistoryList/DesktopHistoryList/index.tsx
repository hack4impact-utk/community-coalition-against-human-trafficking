import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
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
import { LinearProgress } from '@mui/material'

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
  sortFn?(a: LogResponse, b: LogResponse): number
}

function comparator(v1: string | Date, v2: string | Date) {
  if (v1 < v2) {
    return -1
  }

  if (v1 > v2) {
    return 1
  }

  return 0
}

const headCells: readonly HeadCell[] = [
  {
    id: 'staff',
    numeric: false,
    disablePadding: true,
    label: 'Staff',
    sortable: true,
    sortFn: (log1: LogResponse, log2: LogResponse) => {
      return comparator(
        log1.staff.name.toLowerCase(),
        log2.staff.name.toLowerCase()
      )
    },
  },
  {
    id: 'item',
    numeric: false,
    disablePadding: false,
    label: 'Item',
    sortable: true,
    sortFn: (log1: LogResponse, log2: LogResponse) => {
      return comparator(
        log1.item.itemDefinition.name.toLowerCase(),
        log2.item.itemDefinition.name.toLowerCase()
      )
    },
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
    sortable: true,
    sortFn: (log1: LogResponse, log2: LogResponse) => {
      return comparator(
        log1.item.itemDefinition.category?.name.toLowerCase() ?? '',
        log2.item.itemDefinition.category?.name.toLowerCase() ?? ''
      )
    },
  },
  {
    id: 'quantityDelta',
    numeric: false,
    disablePadding: false,
    label: 'Quantity',
    sortable: true,
    sortFn: (log1: LogResponse, log2: LogResponse) => {
      return log1.quantityDelta - log2.quantityDelta
    },
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
    sortable: true,
    sortFn: (log1: LogResponse, log2: LogResponse) => {
      return comparator(log1.date, log2.date)
    },
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
    const orderBy = router.query.sort
    const order = router.query.order
    const isAsc = orderBy === property && order === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'
    await bulkAddURLQueryParams(router, {
      order: newOrder,
      sort: property,
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

  // when a header is clicked

  // when the change page buttons are clicked
  const handleChangePage = (_e: unknown, newPage: number) => {
    if (newPage === 0) {
      updateQuery(router, 'page', '')
    } else {
      updateQuery(router, 'page', newPage.toString())
    }
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateQuery(router, 'page', '')
    if (event.target.value === '10') {
      updateQuery(router, 'limit', '')
    } else {
      updateQuery(router, 'limit', event.target.value)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium">
          <HistoryListHeader
            order={router.query.order as Order}
            orderBy={router.query.sort as string}
            router={router}
          />
          {props.loading && (
            <LinearProgress
              variant="indeterminate"
              sx={{
                display: 'table-header-group',
                width: 'auto',
                backgroundColor: 'transparent',
                height: 3,
              }}
            />
          )}
          <TableBody>
            {props.logs &&
              props.logs.map((log) => (
                <HistoryListItem log={log} key={log._id} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={props.total}
        rowsPerPage={Number(router.query.limit || '10')}
        page={Number(router.query.page || '0')}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}
