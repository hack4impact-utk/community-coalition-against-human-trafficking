import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import React from 'react'
import { ItemDefinitionResponse } from 'utils/types'
import ItemDefinitionListItem from 'components/ItemDefinitionList/DesktopItemDefinitionList/DesktopItemDefinitionListItem'
import usePagination from 'utils/hooks/usePagination'
import SettingsTablePagination from 'components/SettingsTablePagination'
import NoResultsText from 'components/NoResultsText'
import {
  ItemDefinitionContext,
  ItemDefinitionContextType,
} from '../ItemDefintionContext'

/// HEADER ///

interface HeaderCellData {
  key: string
  label: string
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
    label: 'Name',
    sortable: true,
    sortFn: (a, b) => comparator(a.name, b.name),
  },
  {
    key: 'attributes',
    label: 'Item Attributes',
    sortable: false,
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    sortFn: (a, b) => comparator(a.category?.name, b.category?.name),
  },
  {
    key: 'internal',
    label: 'Consumer',
    sortable: true,
    sortFn: (a, b) => internalComparator(a.internal, b.internal),
  },
  {
    key: 'threshold',
    label: 'Low quantity / Critically low quantity',
    sortable: false,
  },
  {
    key: 'kebab',
    label: '',
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
                  <Typography variant="body2" fontWeight="bold">
                    {headerCell.label}
                  </Typography>
                </Stack>
              </TableSortLabel>
            ) : (
              <Stack direction="column">
                <Typography variant="body2" fontWeight="bold">
                  {headerCell.label}
                </Typography>
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
  search: string
}

// Ascending or Descending
type Order = 'asc' | 'desc'

// Constants
const DEFAULT_ORDER: Order = 'asc'
const DEFAULT_ORDER_BY: HeadKey = 'name'
const DEFAULT_ROWS_PER_PAGE = 10

export default function ItemDefinitionList({
  search,
}: ItemDefinitionListProps) {
  const { itemDefinitions } = React.useContext(
    ItemDefinitionContext
  ) as ItemDefinitionContextType
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
  const pagination = usePagination<ItemDefinitionResponse, HeadKey>(
    itemDefinitions,
    DEFAULT_ROWS_PER_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER,
    sortTable,
    searches
  )

  const shouldShowTable = React.useMemo(
    () => pagination.visibleRows === null || !!pagination.visibleRows?.length,
    [pagination.visibleRows]
  )
  return (
    <Box width={'100%'}>
      <SettingsTablePagination {...pagination} visible={shouldShowTable} />
      <TableContainer
        sx={{
          visibility: shouldShowTable ? 'default' : 'hidden',
        }}
      >
        <Table>
          <ItemDefinitionListHeader
            order={pagination.order}
            orderBy={pagination.orderBy}
            onRequestSort={pagination.handleRequestSort}
          />
          <TableBody>
            {pagination?.visibleRows?.map((itemDefinition) => (
              <ItemDefinitionListItem
                key={itemDefinition._id}
                itemDefinition={itemDefinition}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!shouldShowTable && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <NoResultsText />
        </Box>
      )}
    </Box>
  )
}
