import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import React from 'react'
import { ItemDefinitionResponse } from 'utils/types'
import ItemDefinitionListItem from 'components/ItemDefinitionList/DesktopItemDefinitionList/DesktopItemDefinitionListItem'

/// HEADER ///

interface HeaderCellData {
  key: string
  labels: string[]
  sortable?: boolean
  sortFn?(a: ItemDefinitionResponse, b: ItemDefinitionResponse): number
}

function internalComparator(v1?: boolean, v2?: boolean) {
  if (v1 && !v2) {
    return -1
  }

  if (!v1 && v2) {
    return 1
  }

  return 0
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

type HeadKey =
  | 'name'
  | 'attributes'
  | 'category'
  | 'internal'
  | 'threshold'
  | 'kebab'

function sortTable(
  tableData: ItemDefinitionResponse[],
  sortBy: HeadKey,
  order: Order
) {
  const orderByHeadCell = headerCells.filter(
    (headCell) => headCell.key === sortBy.toString()
  )[0]

  return tableData.sort(
    (a: ItemDefinitionResponse, b: ItemDefinitionResponse) =>
      order === 'asc'
        ? orderByHeadCell.sortFn!(a, b)
        : orderByHeadCell.sortFn!(b, a)
  )
}

function internalString(internal?: boolean) {
  return internal ? 'Staff' : 'Clients'
}

const headerCells: HeaderCellData[] = [
  {
    key: 'name',
    labels: ['Name'],
    sortable: true,
    sortFn: (a, b) => comparator(a.name, b.name),
  },
  {
    key: 'attributes',
    labels: ['Item Attributes'],
    sortable: false,
  },
  {
    key: 'category',
    labels: ['Category'],
    sortable: true,
    sortFn: (a, b) => comparator(a.category?.name, b.category?.name),
  },
  {
    key: 'internal',
    labels: ['Consumer'],
    sortable: true,
    sortFn: (a, b) => internalComparator(a.internal, b.internal),
  },
  {
    key: 'threshold',
    labels: ['Low quantity', 'Critically low quantity'],
    sortable: false,
  },
  {
    key: 'kebab',
    labels: [''],
    sortable: false,
  },
]
interface ItemDefinitionListHeaderProps {
  order: Order
  orderBy: HeadKey
  onRequestSort: (event: React.MouseEvent<unknown>, property: HeadKey) => void
}

function ItemDefinitionListHeader({
  order,
  orderBy,
  onRequestSort,
}: ItemDefinitionListHeaderProps) {
  const createSortHandler =
    (property: HeadKey) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {headerCells.map((headerCell) => (
          <TableCell key={headerCell.key}>
            {headerCell.sortable ? (
              <TableSortLabel
                active={orderBy === headerCell.key}
                direction={order}
                onClick={createSortHandler(headerCell.key as HeadKey)}
              >
                <Stack direction="column">
                  {headerCell.labels.map((label, index) => (
                    <Typography key={index} variant="body2" fontWeight="bold">
                      {label}
                    </Typography>
                  ))}
                </Stack>
              </TableSortLabel>
            ) : (
              <Stack direction="column">
                {headerCell.labels.map((label, index) => (
                  <Typography key={index} variant="body2" fontWeight="bold">
                    {label}
                  </Typography>
                ))}
              </Stack>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

/// TABLE ///

interface ItemDefinitionListProps {
  itemDefinitions: ItemDefinitionResponse[]
  search: string
}

// Ascending or Descending
type Order = 'asc' | 'desc'

// Constants
const DEFAULT_ORDER: Order = 'asc'
const DEFAULT_ORDER_BY: HeadKey = 'name'
const DEFAULT_ROWS_PER_PAGE = 5

export default function ItemDefinitionList({
  itemDefinitions,
  search,
}: ItemDefinitionListProps) {
  const [tableData, setTableData] = React.useState<ItemDefinitionResponse[]>([])
  const [visibleRows, setVisibleRows] = React.useState<
    ItemDefinitionResponse[] | null
  >(null)

  // Sorting hooks
  const [order, setOrder] = React.useState<Order>(DEFAULT_ORDER)
  const [orderBy, setOrderBy] = React.useState<HeadKey>(DEFAULT_ORDER_BY)

  // Pagination hooks
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)

  // useEffect updates table data whenever search prop changes
  React.useEffect(() => {
    let filteredData = itemDefinitions

    if (search) {
      const searchLowerCase = search.toLowerCase()
      filteredData = [
        ...filteredData.filter(
          (itemDefinition) =>
            itemDefinition.name.toLowerCase().includes(searchLowerCase) ||
            (itemDefinition.attributes &&
              itemDefinition.attributes
                .map((attr) => attr.name.toLowerCase())
                .join(' ')
                .includes(searchLowerCase)) ||
            (itemDefinition.category &&
              itemDefinition.category.name
                .toLowerCase()
                .includes(searchLowerCase)) ||
            internalString(itemDefinition.internal)
              .toLowerCase()
              .includes(searchLowerCase)
        ),
      ]
    }

    setTableData(filteredData)

    let rowsOnMount = sortTable(filteredData, orderBy, order)
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    )
    setPage(0)

    setVisibleRows(rowsOnMount)
  }, [search])

  const handleRequestSort = React.useCallback(
    (event: React.MouseEvent<unknown>, newOrderBy: HeadKey) => {
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
      0 * updatedRowsPerPage,
      0 * updatedRowsPerPage + updatedRowsPerPage
    )
    setVisibleRows(updatedRows)
  }

  return (
    <Box width={'100%'}>
      <TableContainer>
        <Table>
          <ItemDefinitionListHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {visibleRows &&
              visibleRows.map((itemDefinition) => (
                <ItemDefinitionListItem
                  key={itemDefinition._id}
                  itemDefinition={itemDefinition}
                />
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
