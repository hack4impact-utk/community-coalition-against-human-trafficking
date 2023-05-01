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
import { AttributeResponse, ItemDefinitionResponse } from 'utils/types'
import DesktopItemDefinitionListItem from 'components/ItemDefinitionList/DesktopItemDefinitionList/DesktopItemDefinitionListItem'

/// HEADER ///

interface DesktopItemDefinitionListHeaderProps {
  order: Order
  orderBy: keyof SearchableData
  handleSort: (newOrderBy: keyof SearchableData) => void
}

interface HeaderCellData {
  key: string
  labels: string[]
  sortable: boolean
}

function DesktopItemDefinitionListHeader({
  order,
  orderBy,
  handleSort,
}: DesktopItemDefinitionListHeaderProps) {
  const headerCells: HeaderCellData[] = [
    {
      key: 'name',
      labels: ['Name'],
      sortable: true,
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
    },
    {
      key: 'internal',
      labels: ['Consumer'],
      sortable: true,
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

  const createSortHandler =
    (key: keyof SearchableData) => (event: React.MouseEvent<unknown>) => {
      handleSort(key)
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
                onClick={createSortHandler(
                  headerCell.key as keyof SearchableData
                )}
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

interface DesktopItemDefinitionListProps {
  itemDefinitions: ItemDefinitionResponse[]
  search: string
}

interface SearchableData {
  id: string
  name: string
  attributes?: AttributeResponse[]
  category: string
  internal: string
  itemDefinitionResponse: ItemDefinitionResponse
}

// Sorting helper functions

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

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

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
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

// Ascending or Descending
type Order = 'asc' | 'desc'

// Constants
const DEFAULT_ORDER: Order = 'asc'
const DEFAULT_ORDER_BY: keyof SearchableData = 'name'
const DEFAULT_ROWS_PER_PAGE = 5

export default function DesktopItemDefinitionList({
  itemDefinitions,
  search,
}: DesktopItemDefinitionListProps) {
  const [tableData, setTableData] = React.useState<SearchableData[]>([])
  const [visibleRows, setVisibleRows] = React.useState<SearchableData[] | null>(
    null
  )

  // Sorting hooks
  const [order, setOrder] = React.useState<Order>(DEFAULT_ORDER)
  const [orderBy, setOrderBy] =
    React.useState<keyof SearchableData>(DEFAULT_ORDER_BY)

  // Pagination hooks
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)

  // useEffect updates table data whenever search prop changes
  React.useEffect(() => {
    let filteredData = itemDefinitions.map(
      (itemDefinition) =>
        ({
          id: itemDefinition._id,
          name: itemDefinition.name,
          attributes: itemDefinition.attributes,
          category: itemDefinition.category?.name,
          internal: itemDefinition.internal ? 'Staff' : 'Clients',
          itemDefinitionResponse: itemDefinition,
        } as SearchableData)
    )

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
              itemDefinition.category
                .toLowerCase()
                .includes(searchLowerCase)) ||
            itemDefinition.internal.toLowerCase().includes(searchLowerCase)
        ),
      ]
    }

    setTableData(filteredData)

    // @ts-ignore
    let rowsOnMount = stableSort(filteredData, getComparator(order, orderBy))
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    )

    // @ts-ignore
    setVisibleRows(rowsOnMount)
  }, [search])

  const handleSort = (newOrderBy: keyof SearchableData) => {
    const isAsc = orderBy === newOrderBy && order === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(newOrderBy)

    const sortedRows = stableSort(
      // @ts-ignore
      tableData,
      getComparator(newOrder, newOrderBy)
    )
    const updatedRows = sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
    // @ts-ignore
    setVisibleRows(updatedRows)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    // @ts-ignore
    const sortedRows = stableSort(tableData, getComparator(order, orderBy))
    const updatedRows = sortedRows.slice(
      newPage * rowsPerPage,
      newPage * rowsPerPage + rowsPerPage
    )
    // @ts-ignore
    setVisibleRows(updatedRows)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(updatedRowsPerPage)
    setPage(0)

    // @ts-ignore
    const sortedRows = stableSort(tableData, getComparator(order, orderBy))
    const updatedRows = sortedRows.slice(
      0 * updatedRowsPerPage,
      0 * updatedRowsPerPage + updatedRowsPerPage
    )
    // @ts-ignore
    setVisibleRows(updatedRows)
  }

  return (
    <Box width={'100%'}>
      <TableContainer>
        <Table>
          <DesktopItemDefinitionListHeader
            order={order}
            orderBy={orderBy}
            handleSort={handleSort}
          />
          <TableBody>
            {visibleRows &&
              visibleRows.map((itemDefinition) => (
                <DesktopItemDefinitionListItem
                  itemDefinition={itemDefinition.itemDefinitionResponse}
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
