import {
  ListItem,
  ListItemText,
  Typography,
  Box,
  ListItemSecondaryAction,
  Avatar,
  useTheme,
} from '@mui/material'
import HistoryListItemKebab from 'components/HistoryList/HistoryListItemKebab'
import renderAttributeChips from 'utils/renderAttributeChips'
import { DateToReadableDateString } from 'utils/transformations'
import { LogResponse } from 'utils/types'

interface Props {
  log: LogResponse
}

export default function MobileHistoryListItem({ log }: Props) {
  const theme = useTheme()
  return (
    <ListItem alignItems="flex-start" divider>
      <Box>
        <ListItemText sx={{ mb: -0.5 }}>
          <Box
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
              }}
              component="span"
              variant="body1"
            >
              {log.item.itemDefinition.name}
            </Typography>
            <Typography
              variant="body2"
              color={
                log.quantityDelta > 0
                  ? theme.palette.success.light
                  : theme.palette.error.light
              }
              ml={1}
            >
              {`${log.quantityDelta > 0 ? '+' : ''}${log.quantityDelta}`}
            </Typography>
          </Box>
        </ListItemText>
        <ListItemText>
          <Box sx={{ maxWidth: '200px' }}>
            {renderAttributeChips(log.item.attributes)}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {DateToReadableDateString(log.date)}
          </Typography>
        </ListItemText>
      </Box>
      <ListItemSecondaryAction sx={{ display: 'flex' }}>
        <Avatar src={log.staff.image} sx={{ mr: 2 }} />
        <HistoryListItemKebab log={log} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}
