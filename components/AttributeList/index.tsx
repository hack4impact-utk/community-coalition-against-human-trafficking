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
type Order = 'asc' | 'desc'

interface HeadCell {
  disablePadding: boolean
  id: keyof AttributeTableData
  label: string
  numeric: boolean
  sortable?: boolean
  sortFn?(a: AttributeResponse, b: AttributeResponse): number
}

function sortTable(
  tableData: AttributeResponse[],
  sortBy: keyof AttributeTableData,
  order: Order
) {
  const orderByHeadCell = headCells.filter(
    (headCell) => headCell.id === sortBy.toString()
  )[0]

  return tableData.sort((a: AttributeResponse, b: AttributeResponse) =>
    order === 'asc'
      ? orderByHeadCell.sortFn!(a, b)
      : orderByHeadCell.sortFn!(b, a)
  )
}

function comparator(v1: string, v2: string) {
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
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Attribute Name',
    sortable: true,
    sortFn(a, b) {
      return comparator(a.name, b.name)
    },
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
  const [visibleRows, setVisibleRows] = useState<AttributeResponse[] | null>(
    null
  )
  const [sortedTableData, setSortedTableData] = useState<AttributeResponse[]>(
    []
  )

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

    const newSortedData = sortTable(
      newTableData,
      DEFAULT_ORDER_BY,
      DEFAULT_ORDER
    )
    setSortedTableData(newSortedData)
    const rowsOnMount = newSortedData.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    )
    setPage(0)

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

      const newSortedTableData = sortTable(
        sortedTableData,
        newOrderBy,
        toggledOrder
      )
      setPage(0)
      setSortedTableData(newSortedTableData)
      const newVisibleRows = newSortedTableData.slice(
        0 * rowsPerPage,
        0 * rowsPerPage + rowsPerPage
      )
      setVisibleRows(newVisibleRows)
    },
    [order, orderBy, page, rowsPerPage, sortedTableData]
  )

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    const newVisibleRows = sortedTableData.slice(
      newPage * rowsPerPage,
      newPage * rowsPerPage + rowsPerPage
    )
    setVisibleRows(newVisibleRows)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(updatedRowsPerPage)
    setPage(0)
    const newVisibleRows = sortedTableData.slice(
      0 * updatedRowsPerPage,
      0 * updatedRowsPerPage + updatedRowsPerPage
    )
    setVisibleRows(newVisibleRows)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 999,
        }}
      >
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedTableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
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
    </Box>
  )
}
