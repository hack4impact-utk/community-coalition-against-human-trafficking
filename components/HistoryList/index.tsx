import { useMediaQuery, useTheme } from '@mui/material'
import dynamic from 'next/dynamic'
import { LogResponse } from 'utils/types'

interface HistoryListProps {
  logs: LogResponse[]
  search: string
  category: string
  endDate: string
  startDate: string
  internal: boolean
  setTableData: React.Dispatch<React.SetStateAction<LogResponse[]>>
}

export default function HistoryList({
  logs,
  search,
  category,
  endDate,
  startDate,
  internal,
  setTableData,
}: HistoryListProps) {
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const Mobile = dynamic(
    () => import('components/HistoryList/MobileHistoryList')
  )
  const Desktop = dynamic(
    () => import('components/HistoryList/DesktopHistoryList')
  )
  return (
    <>
      {isMobileView ? (
        <Mobile
          logs={logs}
          search={search}
          category={category}
          endDate={endDate}
          startDate={startDate}
          internal={internal}
          setTableData={setTableData}
        />
      ) : (
        <Desktop
          logs={logs}
          search={search}
          category={category}
          endDate={endDate}
          startDate={startDate}
          internal={internal}
          setTableData={setTableData}
        />
      )}
    </>
  )
}
