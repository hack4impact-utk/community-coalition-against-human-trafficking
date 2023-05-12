import { List } from '@mui/material'
import React from 'react'
import { LogResponse } from 'utils/types'
import MobileHistoryListItem from 'components/HistoryList/MobileHistoryList/MobileHistoryListItem'
import InfiniteScroll from 'components/InfiniteScroll'
import { useRouter } from 'next/router'
import { historyPaginationDefaults } from 'utils/constants'

interface Props {
  logs: LogResponse[]
  search: string
  category: string
  endDate: string
  startDate: string
  internal: boolean
  total: number
  setTableData: React.Dispatch<React.SetStateAction<LogResponse[]>>
}

function dateComparator(v1: Date, v2: Date) {
  if (v1 < v2) {
    return -1
  }

  if (v1 > v2) {
    return 1
  }

  return 0
}

const constructQueryString = (params: { [key: string]: string }) => {
  if (Object.keys(params).length === 0) return ''
  return `&${Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`
}

export default function MobileHistoryList(props: Props) {
  const [visibleRows, setVisibleRows] = React.useState<LogResponse[]>(
    props.logs
  )
  const [page, setPage] = React.useState<number>(0)
  const { limit } = historyPaginationDefaults
  const router = useRouter()

  const nextFn = React.useCallback(async () => {
    const newPage = page + 1
    setPage((prev) => {
      return prev + 1
    })
    const response = await fetch(
      `/api/logs?page=${newPage}${constructQueryString(
        router.query as { [key: string]: string }
      )}}`
    )
    const { payload } = await response.json()

    setVisibleRows((prev) => {
      const t = [...prev, ...payload.data]
      return t
    })
  }, [page, setVisibleRows, setPage, router.query])

  React.useEffect(() => {
    setPage(1)
  }, [router.query])

  React.useEffect(() => {
    // sort table by date
    const newVisibleRows = props.logs.sort(
      (log1: LogResponse, log2: LogResponse) =>
        dateComparator(log2.date, log1.date)
    )

    setVisibleRows(newVisibleRows)
  }, [props.logs])

  return (
    <InfiniteScroll
      next={nextFn}
      hasMore={Number(page) * limit + limit < props.total}
    >
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {visibleRows.map((log) => (
          <MobileHistoryListItem log={log} key={log._id} />
        ))}
      </List>
    </InfiniteScroll>
  )
}
