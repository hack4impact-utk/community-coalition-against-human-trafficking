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
  bulkRemoveURLQueryParams,
} from 'utils/queryParams'
import { LinearProgress } from '@mui/material'
import { historyPaginationDefaults } from 'utils/constants'
import DesktopHistoryListSkeleton from './DesktopHistoryListSkeleton'

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
    const isAsc = orderBy === property && order === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'
    if (
      newOrder === historyPaginationDefaults.order &&
      property === historyPaginationDefaults.orderBy
    ) {
      await bulkRemoveURLQueryParams(router, ['order', 'orderBy'])
    } else if (property === historyPaginationDefaults.orderBy) {
      await removeURLQueryParam(router, 'orderBy')
      await addURLQueryParam(router, 'order', newOrder)
    } else if (newOrder === historyPaginationDefaults.order) {
      await removeURLQueryParam(router, 'order')
      await addURLQueryParam(router, 'orderBy', property)
    } else {
      await bulkAddURLQueryParams(router, {
        order: newOrder,
        orderBy: property,
      })
    }
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
  const handleChangePage = async (_e: unknown, newPage: number) => {
    if (newPage === historyPaginationDefaults.page) {
      await removeURLQueryParam(router, 'page')
    } else {
      await updateQuery(router, 'page', newPage.toString())
    }
  }

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (Number(event.target.value) === historyPaginationDefaults.limit) {
      await bulkRemoveURLQueryParams(router, ['page', 'limit'])
    } else {
      await removeURLQueryParam(router, 'page')
      await updateQuery(router, 'limit', event.target.value)
    }
  }

  const limit = React.useMemo(() => {
    const queryLimit = Number(router.query.limit)
    return queryLimit ? queryLimit : historyPaginationDefaults.limit
  }, [router.query.limit])

  const page = React.useMemo(() => {
    const queryPage = Number(router.query.page)
    return queryPage ? queryPage : historyPaginationDefaults.page
  }, [router.query.page])
  const order = React.useMemo(() => {
    const queryOrder = router.query.order
    return queryOrder ? (queryOrder as Order) : historyPaginationDefaults.order
  }, [router.query.order])
  const orderBy = React.useMemo(() => {
    const queryOrderBy = router.query.orderBy
    return queryOrderBy
      ? (queryOrderBy as keyof HistoryTableData)
      : historyPaginationDefaults.orderBy
  }, [router.query.orderBy])

  return (
    <Box sx={{ width: '100%' }}>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={props.total}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 999,
        }}
      />
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium">
          <HistoryListHeader
            order={order as Order}
            orderBy={orderBy}
            router={router}
          />
          <TableBody>
            {props.loading ? (
              <DesktopHistoryListSkeleton
                rowsPerPage={Number(
                  router.query.limit || historyPaginationDefaults.limit
                )}
              />
            ) : (
              props.logs.map((log) => (
                <HistoryListItem log={log} key={log._id} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
