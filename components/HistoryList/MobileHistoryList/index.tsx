import { List } from '@mui/material'
import React from 'react'
import { LogResponse } from 'utils/types'
import MobileHistoryListItem from 'components/HistoryList/MobileHistoryList/MobileHistoryListItem'

interface Props {
  logs: LogResponse[]
  search: string
  category: string
  endDate: string
  startDate: string
  internal: boolean
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

export default function MobileHistoryList(props: Props) {
  const [visibleRows, setVisibleRows] = React.useState<LogResponse[]>(
    props.logs
  )

  React.useEffect(() => {
    // sort table by date
    const newVisibleRows = props.logs.sort(
      (log1: LogResponse, log2: LogResponse) =>
        dateComparator(log1.date, log2.date)
    )

    setVisibleRows(newVisibleRows)
  }, [props.logs])

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {visibleRows.map((log) => (
        <MobileHistoryListItem log={log} key={log._id} />
      ))}
    </List>
  )
}
