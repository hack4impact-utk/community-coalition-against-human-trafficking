import { TableRow, TableCell, Box, Avatar, useMediaQuery } from '@mui/material'
import { LogResponse } from 'utils/types'
import Grid2 from '@mui/material/Unstable_Grid2'
import theme from 'utils/theme'
import renderAttributeChips from 'utils/renderAttributeChips'
import { dateToReadableDateString } from 'utils/transformations'

interface HistoryListItemProps {
  log: LogResponse
}

export default function HistoryListItem({ log }: HistoryListItemProps) {
  const isMediumView = useMediaQuery(theme.breakpoints.down('lg'))

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
      <TableCell>{log.item.itemDefinition.category?.name || '-'}</TableCell>
      <TableCell>
        {`${log.quantityDelta > 0 ? '+' : ''}${log.quantityDelta}`}
      </TableCell>
      <TableCell>{dateToReadableDateString(log.date)}</TableCell>
    </TableRow>
  )
}
