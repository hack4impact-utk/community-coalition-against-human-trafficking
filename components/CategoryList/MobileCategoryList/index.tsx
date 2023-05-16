import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
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

interface Props {
  categories: CategoryResponse[]
  search: string
}

const DEFAULT_ORDER_BY = 'name'
const DEFAULT_ORDER = 'asc'

export default function MobileCategoryList(props: Props) {
  const [order, setOrder] = React.useState<Order>(DEFAULT_ORDER)
  const [orderBy, setOrderBy] =
    React.useState<keyof CategoryTableData>(DEFAULT_ORDER_BY)
  const [page, setPage] = React.useState(0)
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
    rowsOnMount = rowsOnMount

    setPage(0)

    setVisibleRows(rowsOnMount)
  }, [props.search])

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium">
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
