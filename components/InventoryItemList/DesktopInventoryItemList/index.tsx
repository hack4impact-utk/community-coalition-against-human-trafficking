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
import InventoryItemListItem from 'components/InventoryItemList/DesktopInventoryItemList/DesktopInventoryItemListItem'
import { InventoryItemResponse } from 'utils/types'
import { inventoryPaginationDefaults } from 'utils/constants'
import {
  addURLQueryParam,
  bulkAddURLQueryParams,
  bulkRemoveURLQueryParams,
  removeURLQueryParam,
} from 'utils/queryParams'
import { NextRouter, useRouter } from 'next/router'
import DesktopInventoryItemListSkeleton from './DesktopInventoryItemListSkeleton'
import NoResultsText from 'components/NoResultsText'

type HeadId =
  | 'name'
  | 'attributes'
  | 'category'
  | 'quantity'
  | 'assignee'
  | 'kebab'

interface HeadCell {
  disablePadding: boolean
  id: HeadId
  label: string
  numeric: boolean
  sortable?: boolean
  showIcon?: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Item Name',
    sortable: true,
  },
  {
    id: 'attributes',
    numeric: false,
    disablePadding: false,
    label: 'Item Attribute',
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
    sortable: true,
  },
  {
    id: 'quantity',
    numeric: true,
    disablePadding: false,
    label: 'Quantity',
    sortable: true,
    showIcon: true,
  },
  {
    id: 'assignee',
    numeric: false,
    disablePadding: false,
    label: 'Assignee',
    sortable: true,
  },
  {
    id: 'kebab',
    numeric: false,
    disablePadding: false,
    label: '',
    sortable: false,
  },
]

type Order = 'asc' | 'desc'

interface EnhancedTableProps {
  order: Order
  orderBy: string
  router: NextRouter
}

function InventoryItemListHeader(props: EnhancedTableProps) {
  const { order, orderBy, router } = props
  const createSortHandler = (property: HeadId) => async () => {
    const isAsc = orderBy === property && order === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'
    if (
      newOrder === inventoryPaginationDefaults.order &&
      property === inventoryPaginationDefaults.orderBy
    ) {
      await bulkRemoveURLQueryParams(router, ['order', 'orderBy'])
    } else if (property === inventoryPaginationDefaults.orderBy) {
      await removeURLQueryParam(router, 'orderBy')
      await addURLQueryParam(router, 'order', newOrder)
    } else if (newOrder === inventoryPaginationDefaults.order) {
      await removeURLQueryParam(router, 'order')
      await addURLQueryParam(router, 'orderBy', property)
    } else {
      await bulkAddURLQueryParams(router, {
        order: newOrder,
        orderBy: property,
      })
    }
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

interface Props {
  inventoryItems: InventoryItemResponse[]
  search: string
  category: string
  total: number
  loading: boolean
}

const updateQuery = async (router: NextRouter, key: string, val?: string) => {
  if (!val) await removeURLQueryParam(router, key)
  else await addURLQueryParam(router, key, val)
}

export default function DesktopInventoryItemList(props: Props) {
  const router = useRouter()

  // when the change page buttons are clicked
  const handleChangePage = (_e: unknown, newPage: number) => {
    if (newPage === inventoryPaginationDefaults.page) {
      removeURLQueryParam(router, 'page')
    } else {
      updateQuery(router, 'page', newPage.toString())
    }
  }

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (Number(event.target.value) === inventoryPaginationDefaults.limit) {
      await bulkRemoveURLQueryParams(router, ['limit', 'page'])
    } else {
      await removeURLQueryParam(router, 'page')
      await updateQuery(router, 'limit', event.target.value)
    }
  }

  const itemsFound = React.useMemo(() => {
    return props.inventoryItems.length > 0 || props.loading
  }, [props.inventoryItems, props.loading])
  const limit = React.useMemo(() => {
    const queryLimit = Number(router.query.limit)
    return queryLimit ? queryLimit : inventoryPaginationDefaults.limit
  }, [router.query.limit])

  const page = React.useMemo(() => {
    const queryPage = Number(router.query.page)
    return queryPage ? queryPage : inventoryPaginationDefaults.page
  }, [router.query.page])
  const order = React.useMemo(() => {
    const queryOrder = router.query.order
    return queryOrder
      ? (queryOrder as Order)
      : inventoryPaginationDefaults.order
  }, [router.query.order])
  const orderBy = React.useMemo(() => {
    const queryOrderBy = router.query.orderBy
    return queryOrderBy
      ? (queryOrderBy as string)
      : inventoryPaginationDefaults.orderBy
  }, [router.query.orderBy])

  return (
    <Box sx={{ width: '100%' }}>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={props.total}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 999,
          visibility: itemsFound ? 'default' : 'hidden',
        }}
        SelectProps={{
          disabled: props.loading,
        }}
        backIconButtonProps={
          props.loading
            ? {
                disabled: props.loading,
              }
            : undefined
        }
        nextIconButtonProps={
          props.loading
            ? {
                disabled: props.loading,
              }
            : undefined
        }
      />
      <TableContainer sx={{ visibility: itemsFound ? 'default' : 'hidden' }}>
        <Table aria-labelledby="tableTitle" size="medium">
          <InventoryItemListHeader
            order={order as Order}
            orderBy={orderBy}
            router={router}
          />
          <TableBody>
            {props.loading ? (
              <DesktopInventoryItemListSkeleton rowsPerPage={limit} />
            ) : (
              props.inventoryItems.map((item) => (
                <InventoryItemListItem inventoryItem={item} key={item._id} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!itemsFound && (
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
