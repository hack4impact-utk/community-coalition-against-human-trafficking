import { List } from '@mui/material'
import React from 'react'
import deepCopy from 'utils/deepCopy'
import { LogResponse } from 'utils/types'
import MobileHistoryListItem from 'components/HistoryList/MobileHistoryList/MobileHistoryListItem'
import { DateToReadableDateString } from 'utils/transformations'

interface Props {
  logs: LogResponse[]
  search: string
  category: string
  endDate: Date
  startDate: Date
  internal: boolean
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
            DateToReadableDateString(log.date).toLowerCase().includes(search)
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

    // sort table by date
    newTableData.sort((log1: LogResponse, log2: LogResponse) =>
      dateComparator(log2.date, log1.date)
    )

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
