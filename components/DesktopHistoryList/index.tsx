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
import InventoryItemListItem from 'components/DesktopInventoryItemList/DesktopInventoryItemListItem'
import {
  InventoryItemAttributeResponse,
  InventoryItemResponse,
  LogResponse,
} from 'utils/types'

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

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HistoryTableData extends LogResponse {
  kebab: string
  category: string
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
const DEFAULT_ORDER = 'asc'

export default function DesktopHistoryList(props: Props) {
  const [order, setOrder] = React.useState<Order>(DEFAULT_ORDER)
  const [orderBy, setOrderBy] =
    React.useState<keyof HistoryTableData>(DEFAULT_ORDER_BY)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)
  const [visibleRows, setVisibleRows] = React.useState<
    HistoryTableData[] | null
  >(null)
  const [tableData, setTableData] = React.useState<HistoryTableData[]>([])

  React.useEffect(() => {
    let newTableData = props.logs.map((log) => {
      return {
        _id: log._id,
        staff: log.staff.name,
        item: log.item.itemDefinition.name,
        category: log.item.itemDefinition.category?.name,
        quantity: log.quantityDelta,
        date: log.date,
        kebab: '',
      }
    })

    // if (props.search) {
    //   const search = props.search.toLowerCase()
    //   newTableData = [
    //     ...newTableData.filter((item) => {
    //       return (
    //         item.name.toLowerCase().includes(search) ||
    //         (item.attributes &&
    //           (item.attributes
    //             .map((attr) => String(attr.value).toLowerCase())
    //             .join(' ')
    //             .includes(search) ||
    //             item.attributes
    //               .map((attr) => attr.attribute.name.toLowerCase())
    //               .join(' ')
    //               .includes(search))) ||
    //         (item.category && item.category.toLowerCase().includes(search)) ||
    //         (item.assignee && item.assignee.toLowerCase().includes(search))
    //       )
    //     }),
    //   ]
    // }

    if (props.category) {
      newTableData = [
        ...newTableData.filter((item) => {
          return item.category === props.category
        }),
      ]
    }
    setTableData(newTableData)
    let rowsOnMount = stableSort(
      newTableData,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY)
    )
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    )

    setVisibleRows(rowsOnMount)
  }, [props.search, props.category])

  const handleRequestSort = React.useCallback(
    (event: React.MouseEvent<unknown>, newOrderBy: keyof Data) => {
      const isAsc = orderBy === newOrderBy && order === 'asc'
      const toggledOrder = isAsc ? 'desc' : 'asc'
      setOrder(toggledOrder)
      setOrderBy(newOrderBy)

      const sortedRows = stableSort(
        tableData,
        getComparator(toggledOrder, newOrderBy)
      )
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
      setVisibleRows(updatedRows)
    },
    [order, orderBy, page, rowsPerPage, tableData]
  )

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    const sortedRows = stableSort(tableData, getComparator(order, orderBy))
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

    const sortedRows = stableSort(tableData, getComparator(order, orderBy))
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
            {visibleRows &&
              visibleRows.map((item) => (
                <HistoryListItem inventoryItemData={item} key={item._id} />
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
