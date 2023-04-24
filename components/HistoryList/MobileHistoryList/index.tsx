import { List } from '@mui/material'
import React from 'react'
import deepCopy from 'utils/deepCopy'
import { LogResponse } from 'utils/types'
import MobileHistoryListItem from 'components/HistoryList/MobileHistoryList/MobileHistoryListItem'

interface Props {
  logs: LogResponse[]
  search: string
  category: string
  endDate: Date
  startDate: Date
  internal: boolean
}

const dateOptions: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
}

export default function MobileHistoryList(props: Props) {
  const [filteredData, setFilteredData] = React.useState<LogResponse[]>(
    [] as LogResponse[]
  )
  React.useEffect(() => {
    let newTableData: LogResponse[] = deepCopy(props.logs)
    if (props.search) {
      const search = props.search.toLowerCase()
      newTableData = [
        ...newTableData.filter((log) => {
          return (
            log.staff.name.toLowerCase().includes(search) ||
            log.item.itemDefinition.name.toLowerCase().includes(search) ||
            (log.item.attributes &&
              log.item.attributes
                .map((attr) =>
                  `${attr.attribute.name}: ${attr.value}`.toLowerCase()
                )
                .join(' ')
                .includes(search)) ||
            (log.item.itemDefinition.category &&
              log.item.itemDefinition.category.name
                .toLowerCase()
                .includes(search)) ||
            log.quantityDelta.toString().toLowerCase().includes(search) ||
            log.date
              .toLocaleString('en-US', dateOptions)
              .replace(' at', '')
              .toLowerCase()
              .includes(search)
          )
        }),
      ]
    }

    if (props.category) {
      newTableData = [
        ...newTableData.filter((log) => {
          return log.item.itemDefinition.category?.name === props.category
        }),
      ]
    }
    setFilteredData(newTableData)
  }, [props.search, props.category])
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {filteredData.map((log) => (
        <MobileHistoryListItem log={log} key={log._id} />
      ))}
    </List>
  )
}
