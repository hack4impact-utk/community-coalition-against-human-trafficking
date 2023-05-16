import { TablePagination } from '@mui/material'
import React from 'react'
import usePagination from 'utils/hooks/usePagination'

type Pagination<TData, TDataKey extends string> = ReturnType<
  typeof usePagination<TData, TDataKey>
>

export default function SettingsTablePagination<TData, TDataKey extends string>(
  pagination: Pagination<TData, TDataKey>
) {
  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={pagination.sortedTableData.length}
      rowsPerPage={pagination.rowsPerPage}
      page={pagination.page}
      onPageChange={pagination.handleChangePage}
      onRowsPerPageChange={pagination.handleChangeRowsPerPage}
      sx={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 999,
      }}
    />
  )
}
