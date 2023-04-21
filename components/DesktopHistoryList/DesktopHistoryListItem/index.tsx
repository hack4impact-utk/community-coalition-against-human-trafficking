import {
  TableRow,
  TableCell,
  Chip,
  Box,
  Typography,
  Avatar,
} from '@mui/material'
import AttributeListItemKebab from 'components/AttributeList/AttributeListItemKebab'
import { LogResponse } from 'utils/types'
import HistoryListItemKebab from '../HistoryListItemKebab'
import getContrastYIQ from 'utils/getContrastYIQ'

interface HistoryTableData extends LogResponse {
  //TODO pull out
  kebab: string
  category: string
}

interface HistoryListItemProps {
  log: LogResponse
}

const renderAttributeChips = (log: LogResponse) => {
  //TODO pull this into its own component
  return log.item.attributes?.map((itemAttribute, i) => {
    // attributes that are strings or numbers show the attribute name
    // attributes that are list types do not

    const displayString =
      itemAttribute.attribute.possibleValues instanceof Array
        ? itemAttribute.value
        : `${itemAttribute.attribute.name}: ${itemAttribute.value}`

    return (
      <Chip
        size="small"
        label={displayString}
        key={i}
        sx={{
          ml: 1,
          my: 0.5,
          backgroundColor: itemAttribute.attribute.color,
          '& .MuiChip-label': {
            color: getContrastYIQ(itemAttribute.attribute.color),
          },
        }}
      />
    )
  })
}

export default function HistoryListItem({ log }: HistoryListItemProps) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  return (
    <TableRow>
      <TableCell>
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Box mr={2}>
            <Avatar src={log.staff?.image || ''} />
          </Box>
          {log.staff.name}
        </Box>
      </TableCell>
      <TableCell>
        {log.item.itemDefinition.name}
        {renderAttributeChips(log)}
      </TableCell>
      <TableCell>{log.item.itemDefinition.category?.name}</TableCell>
      <TableCell>
        {`${log.quantityDelta > 0 ? '+' : ''}${log.quantityDelta}`}
      </TableCell>
      <TableCell>
        {log.date.toLocaleString('en-US', dateOptions).replace(' at', '')}
      </TableCell>
      <TableCell sx={{ width: '10px' }}>
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <HistoryListItemKebab log={log} />
        </Box>
      </TableCell>
    </TableRow>
  )
}
