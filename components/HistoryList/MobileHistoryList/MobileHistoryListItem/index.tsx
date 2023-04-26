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
import { LogResponse } from 'utils/types'

interface Props {
  log: LogResponse
}

export default function MobileHistoryListItem({ log }: Props) {
  const theme = useTheme()
  return (
    <ListItem alignItems="flex-start" divider>
      <ListItemText
        primary={
          <Typography
            sx={{
              fontWeight: 'bold',
            }}
            component="span"
            variant="body1"
          >
            {log.item.itemDefinition.name}
          </Typography>
        }
        secondary={
          <Box>
            {renderAttributeChips(log.item.attributes)}
            <Typography
              variant="body2"
              color={
                log.quantityDelta > 0
                  ? theme.palette.success.light
                  : theme.palette.error.light
              }
            >
              {`${log.quantityDelta > 0 ? '+' : ''}${log.quantityDelta}`}
            </Typography>
          </Box>
        }
      />
      <ListItemSecondaryAction sx={{ display: 'flex' }}>
        <Avatar src={log.staff.image} sx={{ mr: 2 }} />
        <HistoryListItemKebab log={log} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}
