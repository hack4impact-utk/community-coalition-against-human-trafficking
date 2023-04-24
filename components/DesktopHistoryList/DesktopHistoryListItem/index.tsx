import { TableRow, TableCell, Chip, Box, Avatar } from '@mui/material'
import { LogResponse } from 'utils/types'
import HistoryListItemKebab from '../HistoryListItemKebab'
import getContrastYIQ from 'utils/getContrastYIQ'
import Grid2 from '@mui/material/Unstable_Grid2'

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
        <Grid2 container display="row" sx={{ alignItems: 'center' }}>
          <Grid2 xs={4}>{log.item.itemDefinition.name}</Grid2>
          <Grid2 xs={8}>{renderAttributeChips(log)}</Grid2>
        </Grid2>
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
