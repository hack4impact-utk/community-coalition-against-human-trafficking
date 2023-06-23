import React from 'react'

type Order = 'asc' | 'desc'

interface Search<TData, TSearch> {
  search: TSearch
  filterFn: (item: TData, search: TSearch) => boolean
}

export default function usePagination<TData, TDataKey extends string>(
  items: TData[],
  defaultRowsPerPage: number,
  defaultOrderBy: TDataKey,
  defaultOrder: Order,
  tableSortFn: (data: TData[], sortBy: TDataKey, order: Order) => TData[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searches?: Search<TData, any>[]
) {
  const [order, setOrder] = React.useState<Order>(defaultOrder)
  const [orderBy, setOrderBy] = React.useState<TDataKey>(defaultOrderBy)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage)
  const [visibleRows, setVisibleRows] = React.useState<TData[] | null>(null)
  const [sortedTableData, setSortedTableData] = React.useState<TData[] | null>(
    null
  )

  React.useEffect(() => {
    let newTableData = items
    if (searches) {
      newTableData = [
        ...items.filter((item) => {
          for (const search of searches) {
            if (!search.filterFn(item, search.search)) return false
          }
          return true
        }),
      ]
    }
    const newSortedData = tableSortFn(newTableData, orderBy, order)
    setSortedTableData(newSortedData)
  }, [searches, items, orderBy, order])

  React.useEffect(() => {
    if (sortedTableData === null) return
    const newVisibleRows = sortedTableData.slice(
      0 * rowsPerPage,
      0 * rowsPerPage + rowsPerPage
    )
    setPage(0)
    setVisibleRows(newVisibleRows)
  }, [searches])

  React.useEffect(() => {
    if (sortedTableData === null) return
    const rowsOnMount = sortedTableData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )

    setVisibleRows(rowsOnMount)
  }, [sortedTableData, page, rowsPerPage])

  const handleRequestSort = React.useCallback(
    (event: React.MouseEvent<unknown>, newOrderBy: TDataKey) => {
      if (sortedTableData === null) return
      const isAsc = orderBy === newOrderBy && order === 'asc'
      const toggledOrder = isAsc ? 'desc' : 'asc'
      setOrder(toggledOrder)
      setOrderBy(newOrderBy)

      const newSortedTableData = tableSortFn(
        sortedTableData,
        newOrderBy,
        toggledOrder
      )
      setPage(0)
      setSortedTableData(newSortedTableData)
      const newVisibleRows = newSortedTableData.slice(
        0 * rowsPerPage,
        0 * rowsPerPage + rowsPerPage
      )
      setVisibleRows(newVisibleRows)
    },
    [order, orderBy, page, rowsPerPage, sortedTableData]
  )

  const handleChangePage = React.useCallback(
    (event: unknown, newPage: number) => {
      if (sortedTableData === null) return
      setPage(newPage)
      const newVisibleRows = sortedTableData.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage
      )
      setVisibleRows(newVisibleRows)
    },
    [rowsPerPage, sortedTableData]
  )

  const handleChangeRowsPerPage = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (sortedTableData === null) return
      const updatedRowsPerPage = parseInt(event.target.value, 10)
      setRowsPerPage(updatedRowsPerPage)
      setPage(0)
      const newVisibleRows = sortedTableData.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage
      )
      setVisibleRows(newVisibleRows)
    },
    [sortedTableData]
  )

  return {
    order,
    setOrder,
    orderBy,
    setOrderBy,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    visibleRows,
    setVisibleRows,
    sortedTableData,
    setSortedTableData,
    handleRequestSort,
    handleChangePage,
    handleChangeRowsPerPage,
  }
}
