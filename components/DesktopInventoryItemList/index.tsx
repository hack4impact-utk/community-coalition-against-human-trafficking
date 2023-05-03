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
import { InventoryItemResponse } from 'utils/types'

type HeadId =
  | 'name'
  | 'attributes'
  | 'category'
  | 'quantity'
  | 'assignee'
  | 'kebab'

interface HeadCell {
  disablePadding: boolean
  id: HeadId
  label: string
  numeric: boolean
  sortable?: boolean
  sortFn?(a: InventoryItemResponse, b: InventoryItemResponse): number
}

function comparator(v1?: string | number, v2?: string | number) {
  if (!v1 || !v2) {
    return 0
  }

  if (v1 < v2) {
    return -1
  }

  if (v1 > v2) {
    return 1
  }

  return 0
}

function sortTable(
  tableData: InventoryItemResponse[],
  sortBy: HeadId,
  order: Order
) {
  const orderByHeadCell = headCells.filter(
    (headCell) => headCell.id === sortBy.toString()
  )[0]

  return tableData.sort((a: InventoryItemResponse, b: InventoryItemResponse) =>
    order === 'asc'
      ? orderByHeadCell.sortFn!(a, b)
      : orderByHeadCell.sortFn!(b, a)
  )
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Item Name',
    sortable: true,
    sortFn(a, b) {
      return comparator(a.itemDefinition.name, b.itemDefinition.name)
    },
  },
  {
    id: 'attributes',
    numeric: false,
    disablePadding: false,
    label: 'Item Attribute',
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
    sortable: true,
    sortFn(a, b) {
      return comparator(
        a.itemDefinition.category?.name,
        b.itemDefinition.category?.name
      )
    },
  },
  {
    id: 'quantity',
    numeric: false,
    disablePadding: false,
    label: 'Quantity',
    sortable: true,
    sortFn(a, b) {
      return comparator(a.quantity, b.quantity)
    },
  },
  {
    id: 'assignee',
    numeric: false,
    disablePadding: false,
    label: 'Assignee',
    sortable: true,
    sortFn(a, b) {
      return comparator(a.assignee?.name, b.assignee?.name)
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

type Order = 'asc' | 'desc'

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: HeadId) => void
  order: Order
  orderBy: string
}

function InventoryItemListHeader(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler =
    (property: HeadId) => (event: React.MouseEvent<unknown>) => {
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
            // padding={headCell.disablePadding ? 'none' : 'normal'}
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
  inventoryItems: InventoryItemResponse[]
  search: string
  category: string
}

const DEFAULT_ROWS_PER_PAGE = 5
const DEFAULT_ORDER_BY = 'name'
const DEFAULT_ORDER = 'asc'

export default function DesktopInventoryItemList(props: Props) {
  const [order, setOrder] = React.useState<Order>(DEFAULT_ORDER)
  const [orderBy, setOrderBy] = React.useState<HeadId>(DEFAULT_ORDER_BY)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)
  const [visibleRows, setVisibleRows] = React.useState<
    InventoryItemResponse[] | null
  >(null)
  const [tableData, setTableData] = React.useState<InventoryItemResponse[]>([])

  React.useEffect(() => {
    let newTableData = props.inventoryItems

    if (props.search) {
      const search = props.search.toLowerCase()
      newTableData = [
        ...newTableData.filter((item) => {
          return (
            item.itemDefinition.name.toLowerCase().includes(search) ||
            (item.attributes &&
              item.attributes
                .map((attr) =>
                  `${attr.attribute.name}: ${attr.value}`.toLowerCase()
                )
                .join(' ')
                .includes(search)) ||
            (item.itemDefinition.category?.name &&
              item.itemDefinition.category?.name
                .toLowerCase()
                .includes(search)) ||
            (item.assignee && item.assignee.name.toLowerCase().includes(search))
          )
        }),
      ]
    }

    if (props.category) {
      newTableData = [
        ...newTableData.filter((item) => {
          return item.itemDefinition.category?.name === props.category
        }),
      ]
    }
    setTableData(newTableData)

    let rowsOnMount = sortTable(newTableData, orderBy, order)
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    )

    setVisibleRows(rowsOnMount)
  }, [props.search, props.category])

  const handleRequestSort = React.useCallback(
    (event: React.MouseEvent<unknown>, newOrderBy: HeadId) => {
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

  const handleChangePage = (event: unknown, newPage: number) => {
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
      0 * updatedRowsPerPage,
      0 * updatedRowsPerPage + updatedRowsPerPage
    )
    setVisibleRows(updatedRows)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium">
          <InventoryItemListHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {visibleRows &&
              visibleRows.map((item) => (
                <InventoryItemListItem inventoryItem={item} key={item._id} />
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
