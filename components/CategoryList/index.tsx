import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import { CategoryResponse } from 'utils/types'
import CategoryListItem from 'components/CategoryList/CategoryListItem'
import usePagination from 'utils/hooks/usePagination'
import SettingsTablePagination from 'components/SettingsTablePagination'
import NoResultsText from 'components/NoResultsText'

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
  const searches = React.useMemo(() => {
    return [
      {
        search: props.search,
        filterFn: (category: CategoryResponse, s: string) => {
          if (!s) return true
          const search = s.toLowerCase()
          return category.name.toLowerCase().includes(search)
        },
      },
    ]
  }, [props.search])

  const pagination = usePagination<CategoryResponse, keyof CategoryTableData>(
    props.categories,
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
          visibility: pagination.visibleRows?.length ? 'default' : 'hidden',
        }}
      >
        <Table aria-labelledby="tableTitle" size="medium">
          <CategoryListHeader
            order={pagination.order}
            orderBy={pagination.orderBy}
            onRequestSort={pagination.handleRequestSort}
          />
          <TableBody>
            {pagination.visibleRows?.length &&
              pagination.visibleRows.map((category) => (
                <CategoryListItem category={category} key={category._id} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!pagination.visibleRows?.length && (
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
