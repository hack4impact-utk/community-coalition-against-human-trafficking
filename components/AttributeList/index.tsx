import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { AttributeResponse } from 'utils/types'
import { useState, useEffect, useCallback } from 'react'
import AttributeListItem from './AttributeListItem'

interface AttributeTableData extends AttributeResponse {
  kebab: string
}

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | string[] },
  b: { [key in Key]: number | string | string[] }
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

interface HeadCell {
  disablePadding: boolean
  id: keyof AttributeTableData
  label: string
  numeric: boolean
  sortable?: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Attribute Name',
    sortable: true,
  },
  {
    id: 'possibleValues',
    numeric: false,
    disablePadding: false,
    label: 'Possible Values',
    sortable: false,
  },
  {
    id: 'color',
    numeric: false,
    disablePadding: false,
    label: 'Color',
    sortable: false,
  },
  {
    id: 'kebab',
    numeric: false,
    disablePadding: false,
    label: '',
    sortable: false,
  },
]

interface AttributeListHeaderProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof AttributeTableData
  ) => void
  order: Order
  orderBy: string
}

function AttributeListHeader({
  order,
  orderBy,
  onRequestSort,
}: AttributeListHeaderProps) {
  const createSortHandler =
    (property: keyof AttributeTableData) =>
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

interface AttributeListProps {
  attributes: AttributeResponse[]
  search: string
}

const DEFAULT_ROWS_PER_PAGE = 5
const DEFAULT_ORDER_BY = 'name'
const DEFAULT_ORDER = 'asc'

export default function AttributeList({
  attributes,
  search,
}: AttributeListProps) {
  const [order, setOrder] = useState<Order>(DEFAULT_ORDER)
  const [orderBy, setOrderBy] =
    useState<keyof AttributeTableData>(DEFAULT_ORDER_BY)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)
  const [visibleRows, setVisibleRows] = useState<AttributeTableData[] | null>(
    null
  )
  const [tableData, setTableData] = useState<AttributeTableData[]>([])

  useEffect(() => {
    let newTableData = attributes.map((attribute) => {
      return {
        _id: attribute._id,
        name: attribute.name,
        possibleValues: attribute.possibleValues,
        color: attribute.color,
        kebab: '',
      }
    })

    if (search) {
      const lowercaseSearch = search.toLowerCase()
      newTableData = [
        ...newTableData.filter((attribute) => {
          return (
            attribute.name.toLowerCase().includes(search) ||
            (typeof attribute.possibleValues === 'string' &&
              attribute.possibleValues.includes(lowercaseSearch)) ||
            (typeof attribute.possibleValues === 'object' &&
              attribute.possibleValues
                .map((value) => value.toLowerCase())
                .join(' ')
                .includes(lowercaseSearch))
          )
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
  }, [search])

  const handleRequestSort = useCallback(
    (
      event: React.MouseEvent<unknown>,
      newOrderBy: keyof AttributeTableData
    ) => {
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
          <AttributeListHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {visibleRows &&
              visibleRows.map((item) => (
                <AttributeListItem attribute={item} key={item._id} />
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
