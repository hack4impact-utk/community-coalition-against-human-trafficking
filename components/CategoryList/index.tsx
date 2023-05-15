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
import { CategoryResponse } from 'utils/types'
import CategoryListItem from 'components/CategoryList/CategoryListItem'
import deepCopy from 'utils/deepCopy'

type Order = 'asc' | 'desc'

interface CategoryTableData extends CategoryResponse {
  kebab: string
}

interface HeadCell {
  disablePadding: boolean
  id: keyof CategoryTableData
  label: string
  numeric: boolean
  sortable?: boolean
  sortFn?(a: CategoryResponse, b: CategoryResponse): number
}

function sortTable(
  tableData: CategoryResponse[],
  sortBy: keyof CategoryTableData,
  order: Order
) {
  const orderByHeadCell = headCells.filter(
    (headCell) => headCell.id === sortBy.toString()
  )[0]

  return tableData.sort((a: CategoryResponse, b: CategoryResponse) =>
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
    label: 'Name',
    sortable: true,
    sortFn: (category1: CategoryResponse, category2: CategoryResponse) => {
      return comparator(
        category1.name.toLowerCase(),
        category2.name.toLowerCase()
      )
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
    property: keyof CategoryTableData
  ) => void
  order: Order
  orderBy: string
}

function CategoryListHeader(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler =
    (property: keyof CategoryTableData) =>
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
  categories: CategoryResponse[]
  search: string
}

const DEFAULT_ROWS_PER_PAGE = 5
const DEFAULT_ORDER_BY = 'name'
const DEFAULT_ORDER = 'asc'

export default function DesktopCategoryList(props: Props) {
  const [order, setOrder] = React.useState<Order>(DEFAULT_ORDER)
  const [orderBy, setOrderBy] =
    React.useState<keyof CategoryTableData>(DEFAULT_ORDER_BY)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)
  const [visibleRows, setVisibleRows] = React.useState<CategoryResponse[]>(
    [] as CategoryResponse[]
  )
  const [tableData, setTableData] = React.useState<CategoryResponse[]>([])

  React.useEffect(() => {
    let newTableData: CategoryResponse[] = deepCopy(props.categories)
    if (props.search) {
      const search = props.search.toLowerCase()
      newTableData = [
        ...newTableData.filter((category) => {
          return category.name.toLowerCase().includes(search)
        }),
      ]
    }
    setTableData(newTableData)
    let rowsOnMount = sortTable(newTableData, orderBy, order)
    rowsOnMount = rowsOnMount.slice(0, rowsPerPage)

    setPage(0)

    setVisibleRows(rowsOnMount)
  }, [props.search])

  const handleRequestSort = React.useCallback(
    (_e: React.MouseEvent<unknown>, newOrderBy: keyof CategoryTableData) => {
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

    const updatedRows = tableData.slice(
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

    const updatedRows = tableData.slice(
      page * updatedRowsPerPage,
      page * updatedRowsPerPage + updatedRowsPerPage
    )
    setVisibleRows(updatedRows)
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
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium">
          <CategoryListHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {visibleRows &&
              visibleRows.map((category) => (
                <CategoryListItem category={category} key={category._id} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
