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
import deepCopy from 'utils/deepCopy'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

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
  sortFn?(a: LogResponse, b: LogResponse, orderBy: Order): number
}

const headCells: readonly HeadCell[] = [
  {
    id: 'staff',
    numeric: false,
    disablePadding: true,
    label: 'Staff',
    sortable: true,
    sortFn: (log1: LogResponse, log2: LogResponse, orderBy: Order) => {
      if (log1.staff.name < log2.staff.name) {
        return orderBy === 'asc' ? -1 : 1
      }

      if (log1.staff.name > log2.staff.name) {
        return orderBy === 'asc' ? 1 : -1
      }

      return 0
    },
  },
  {
    id: 'item',
    numeric: false,
    disablePadding: false,
    label: 'Item',
    sortable: true,
    sortFn: (log1: LogResponse, log2: LogResponse, orderBy: Order) => {
      if (log1.item.itemDefinition.name < log2.item.itemDefinition.name) {
        return orderBy === 'asc' ? -1 : 1
      }

      if (log1.item.itemDefinition.name > log2.item.itemDefinition.name) {
        return orderBy === 'asc' ? 1 : -1
      }

      return 0
    },
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
    sortable: true,
    sortFn: (log1: LogResponse, log2: LogResponse, orderBy: Order) => {
      if (
        log1.item.itemDefinition.category?.name! <
        log2.item.itemDefinition.category?.name!
      ) {
        return orderBy === 'asc' ? -1 : 1
      }

      if (
        log1.item.itemDefinition.category?.name! >
        log2.item.itemDefinition.category?.name!
      ) {
        return orderBy === 'asc' ? 1 : -1
      }

      return 0
    },
  },
  {
    id: 'quantityDelta',
    numeric: false,
    disablePadding: false,
    label: 'Quantity',
    sortable: true,
    sortFn: (log1: LogResponse, log2: LogResponse, orderBy: Order) => {
      return orderBy === 'asc'
        ? log1.quantityDelta - log2.quantityDelta
        : log2.quantityDelta - log1.quantityDelta
    },
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
    sortable: true,
    sortFn: (log1: LogResponse, log2: LogResponse, orderBy: Order) => {
      if (log1.date < log2.date) {
        return orderBy === 'asc' ? -1 : 1
      }

      if (log1.date > log2.date) {
        return orderBy === 'asc' ? 1 : -1
      }

      return 0
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
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof HistoryTableData
  ) => void
  order: Order
  orderBy: string
}

function HistoryListHeader(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler =
    (property: keyof HistoryTableData) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
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
  endDate: Date
  startDate: Date
  internal: boolean
}

const DEFAULT_ROWS_PER_PAGE = 5
const DEFAULT_ORDER_BY = 'date'
const DEFAULT_ORDER = 'desc'

export default function DesktopHistoryList(props: Props) {
  const [order, setOrder] = React.useState<Order>(DEFAULT_ORDER)
  const [orderBy, setOrderBy] =
    React.useState<keyof HistoryTableData>(DEFAULT_ORDER_BY)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)
  const [visibleRows, setVisibleRows] = React.useState<LogResponse[]>(
    [] as LogResponse[]
  )
  const [tableData, setTableData] = React.useState<any>([])

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  React.useEffect(() => {
    let newTableData: LogResponse[] = deepCopy(props.logs)

    if (props.search) {
      const search = props.search.toLowerCase()
      newTableData = [
        ...newTableData.filter((log) => {
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
            log.date
              .toLocaleString('en-US', dateOptions)
              .replace(' at', '')
              .toLowerCase()
              .includes(search)
          )
        }),
      ]
    }

    if (props.category) {
      newTableData = [
        ...newTableData.filter((log) => {
          return log.item.itemDefinition.category?.name === props.category
        }),
      ]
    }
    setTableData(newTableData)

    const orderByHeadCell = headCells.filter(
      (headCell) => headCell.id === DEFAULT_ORDER_BY.toString()
    )[0]
    var rowsOnMount = newTableData.sort((a: LogResponse, b: LogResponse) =>
      orderByHeadCell.sortFn!(a, b, DEFAULT_ORDER)
    )
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    )

    setVisibleRows(rowsOnMount)
  }, [props.search, props.category])

  const handleRequestSort = React.useCallback(
    (_e: React.MouseEvent<unknown>, newOrderBy: keyof HistoryTableData) => {
      const isAsc = orderBy === newOrderBy && order === 'asc'
      const toggledOrder: Order = isAsc ? 'desc' : 'asc'
      setOrder(toggledOrder)
      setOrderBy(newOrderBy)

      const orderByHeadCell = headCells.filter(
        (headCell) => headCell.id === newOrderBy.toString()
      )[0]
      const sortedRows = tableData.sort((a: LogResponse, b: LogResponse) =>
        orderByHeadCell.sortFn!(a, b, toggledOrder)
      )
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
      setVisibleRows(updatedRows)
    },
    [order, orderBy, page, rowsPerPage, tableData]
  )

  const handleChangePage = (_e: unknown, newPage: number) => {
    setPage(newPage)
    const orderByHeadCell = headCells.filter(
      (headCell) => headCell.id === orderBy.toString()
    )[0]
    const sortedRows = tableData.sort((a: LogResponse, b: LogResponse) =>
      orderByHeadCell.sortFn!(a, b, order)
    )

    const updatedRows = sortedRows.slice(
      newPage * rowsPerPage,
      newPage * rowsPerPage + rowsPerPage
    )
    setVisibleRows(updatedRows)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(updatedRowsPerPage)
    setPage(0)

    const orderByHeadCell = headCells.filter(
      (headCell) => headCell.id === orderBy.toString()
    )[0]
    const sortedRows = tableData.sort((a: LogResponse, b: LogResponse) =>
      orderByHeadCell.sortFn!(a, b, order)
    )

    const updatedRows = sortedRows.slice(
      0 * updatedRowsPerPage,
      0 * updatedRowsPerPage + updatedRowsPerPage
    )
    setVisibleRows(updatedRows)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium">
          <HistoryListHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {true &&
              visibleRows.map((log) => (
                <HistoryListItem log={log} key={log._id} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2, 5, 10, 25]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}
