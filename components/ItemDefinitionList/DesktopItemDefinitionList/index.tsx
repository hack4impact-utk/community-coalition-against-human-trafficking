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
import usePagination from 'utils/hooks/usePagination'

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
  const searches = React.useMemo(() => {
    return [
      {
        search: search,
        filterFn: (itemDefinition: ItemDefinitionResponse, search: string) => {
          if (!search) return true
          const searchLowerCase = search.toLowerCase()
          return (
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
          )
        },
      },
    ]
  }, [search])
  const {
    order,
    orderBy,
    page,
    rowsPerPage,
    visibleRows,
    sortedTableData,
    handleChangePage,
    handleChangeRowsPerPage,
    handleRequestSort,
  } = usePagination<ItemDefinitionResponse, HeadKey>(
    itemDefinitions,
    DEFAULT_ROWS_PER_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER,
    sortTable,
    searches
  )
  return (
    <Box width={'100%'}>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedTableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
    </Box>
  )
}
