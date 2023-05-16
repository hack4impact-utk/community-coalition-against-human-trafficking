import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { AttributeResponse } from 'utils/types'
import AttributeListItem from './AttributeListItem'
import usePagination from 'utils/hooks/usePagination'
import React from 'react'
import SettingsTablePagination from 'components/SettingsTablePagination'
import NoResultsText from 'components/NoResultsText'

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
): AttributeResponse[] {
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
      return comparator(a.name.toLowerCase(), b.name.toLowerCase())
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
  const searches = React.useMemo(
    () => [
      {
        search,
        filterFn: (attribute: AttributeResponse, search: string) => {
          if (!search) return true
          const lowercaseSearch = search.toLowerCase()
          return (
            attribute.name.toLowerCase().includes(lowercaseSearch) ||
            (typeof attribute.possibleValues === 'string' &&
              attribute.possibleValues.includes(lowercaseSearch)) ||
            (typeof attribute.possibleValues === 'object' &&
              attribute.possibleValues
                .map((value) => value.toLowerCase())
                .join(' ')
                .includes(lowercaseSearch))
          )
        },
      },
    ],
    [search]
  )

  const pagination = usePagination<AttributeResponse, keyof AttributeTableData>(
    attributes,
    DEFAULT_ROWS_PER_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER,
    sortTable,
    searches
  )

  return (
    <Box sx={{ width: '100%' }}>
      <SettingsTablePagination
        {...pagination}
        visible={!!pagination.visibleRows?.length}
      />
      <TableContainer
        sx={{
          visibility: !!pagination.visibleRows?.length ? 'default' : 'hidden',
        }}
      >
        <Table aria-labelledby="tableTitle" size="medium">
          <AttributeListHeader
            order={pagination.order}
            orderBy={pagination.orderBy}
            onRequestSort={pagination.handleRequestSort}
          />
          <TableBody>
            {pagination.visibleRows &&
              pagination.visibleRows.map((item) => (
                <AttributeListItem attribute={item} key={item._id} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: !!pagination.visibleRows?.length ? 'none' : 'flex',
          justifyContent: 'center',
        }}
      >
        <NoResultsText />
      </Box>
    </Box>
  )
}
