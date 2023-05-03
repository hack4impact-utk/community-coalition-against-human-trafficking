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
import { DateToReadableDateString } from 'utils/transformations'

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

function sortTable(
  tableData: LogResponse[],
  sortBy: keyof HistoryTableData,
  order: Order
) {
  const orderByHeadCell = headCells.filter(
    (headCell) => headCell.id === sortBy.toString()
  )[0]

  return tableData.sort((a: LogResponse, b: LogResponse) =>
    order === 'asc'
      ? orderByHeadCell.sortFn!(a, b)
      : orderByHeadCell.sortFn!(b, a)
  )
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
      return comparator(log1.staff.name, log2.staff.name)
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
        log1.item.itemDefinition.name,
        log2.item.itemDefinition.name
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
        log1.item.itemDefinition.category?.name ?? '',
        log2.item.itemDefinition.category?.name ?? ''
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
      return comparator(log2.date, log1.date)
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
  endDate: string
  startDate: string
  internal: boolean
}

const DEFAULT_ROWS_PER_PAGE = 5
const DEFAULT_ORDER_BY = 'date'
const DEFAULT_ORDER = 'asc'

export default function DesktopHistoryList(props: Props) {
  const [order, setOrder] = React.useState<Order>(DEFAULT_ORDER)
  const [orderBy, setOrderBy] =
    React.useState<keyof HistoryTableData>(DEFAULT_ORDER_BY)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)
  const [visibleRows, setVisibleRows] = React.useState<LogResponse[]>(
    [] as LogResponse[]
  )
  const [tableData, setTableData] = React.useState<LogResponse[]>([])

  React.useEffect(() => {
    let newTableData: LogResponse[] = deepCopy(props.logs)

    if (props.internal) {
      newTableData = newTableData.filter(
        (log) => log.item.itemDefinition.internal
      )
    }

    if (props.search) {
      const search = props.search.toLowerCase()
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
          DateToReadableDateString(log.date).toLowerCase().includes(search)
        )
      })
    }

    if (props.startDate || props.endDate) {
      // if props.startDate or props.endDate are not present, use an arbitrarily far-away date
      const startDate = new Date(props.startDate ?? '1000-01-01').getTime()
      const endDate = new Date(props.endDate ?? '9999-01-01').getTime()
      newTableData = newTableData.filter((log) => {
        return (
          new Date(log.date).getTime() >= startDate &&
          new Date(log.date).getTime() <= endDate
        )
      })
    }

    if (props.category) {
      newTableData = newTableData.filter((log) => {
        return log.item.itemDefinition.category?.name === props.category
      })
    }
    setTableData(newTableData)
    let rowsOnMount = sortTable(newTableData, orderBy, order)
    rowsOnMount = rowsOnMount.slice(0, rowsPerPage)

    setVisibleRows(rowsOnMount)
  }, [
    props.search,
    props.category,
    props.startDate,
    props.endDate,
    props.internal,
  ])

  const handleRequestSort = React.useCallback(
    (_e: React.MouseEvent<unknown>, newOrderBy: keyof HistoryTableData) => {
      const isAsc = orderBy === newOrderBy && order === 'asc'
      const toggledOrder: Order = isAsc ? 'desc' : 'asc'
      setOrder(toggledOrder)
      setOrderBy(newOrderBy)

      const sortedRows = sortTable(tableData, newOrderBy, toggledOrder)
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
    const sortedRows = sortTable(tableData, orderBy, order)

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
    const sortedRows = sortTable(tableData, orderBy, order)

    const updatedRows = sortedRows.slice(
      page * updatedRowsPerPage,
      page * updatedRowsPerPage + updatedRowsPerPage
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
            {visibleRows &&
              visibleRows.map((log) => (
                <HistoryListItem log={log} key={log._id} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
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
