import { TableRow, TableCell, Box, Avatar, useMediaQuery } from '@mui/material'
import { LogResponse } from 'utils/types'
import HistoryListItemKebab from '../../HistoryListItemKebab'
import Grid2 from '@mui/material/Unstable_Grid2'
import theme from 'utils/theme'
import renderAttributeChips from 'utils/renderAttributeChips'

interface HistoryListItemProps {
  log: LogResponse
}

export default function HistoryListItem({ log }: HistoryListItemProps) {
  const isMediumView = useMediaQuery(theme.breakpoints.down('lg'))

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
        <Grid2
          container
          direction={isMediumView ? 'column' : 'row'}
          sx={{ alignItems: 'center' }}
        >
          <Grid2 md={12} lg={4}>
            {log.item.itemDefinition.name}
          </Grid2>
          <Grid2 md={12} lg={8}>
            <Box mt={isMediumView ? 1 : 0}>
              {renderAttributeChips(log.item.attributes)}
            </Box>
          </Grid2>
        </Grid2>
      </TableCell>
      <TableCell>{log.item.itemDefinition.category?.name}</TableCell>
      <TableCell>
        {`${log.quantityDelta > 0 ? '+' : ''}${log.quantityDelta}`}
      </TableCell>
      <TableCell>
        {new Date(log.date)
          .toLocaleString('en-US', dateOptions)
          .replace(' at', '')}
      </TableCell>
      <TableCell sx={{ width: '10px' }}>
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <HistoryListItemKebab log={log} />
        </Box>
      </TableCell>
    </TableRow>
  )
}
