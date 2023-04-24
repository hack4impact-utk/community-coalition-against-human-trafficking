import {
  ListItem,
  ListItemText,
  Typography,
  Box,
  ListItemSecondaryAction,
  Avatar,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import HistoryListItemKebab from 'components/HistoryList/HistoryListItemKebab'
import renderAttributeChips from 'utils/renderAttributeChips'
import { LogResponse } from 'utils/types'

interface Props {
  log: LogResponse
}

export default function MobileHistoryListItem({ log }: Props) {
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
            {log.staff.name}
          </Typography>
        }
        secondary={
          <Typography
            component="span"
            variant="body2"
            sx={{ display: 'block' }}
          >
            {`${log.quantityDelta > 0 ? '+' : ''}${log.quantityDelta}`}
            <br />
            <Grid2 container direction="row" sx={{ alignItems: 'center' }}>
              <Grid2 md={12} lg={4} mr={1}>
                {log.item.itemDefinition.name}
              </Grid2>
              <Grid2 md={12} lg={8}>
                <Box>{renderAttributeChips(log.item.attributes)}</Box>
              </Grid2>
            </Grid2>
          </Typography>
        }
      />
      <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={log.staff.image} sx={{ mr: 2 }} />
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <HistoryListItemKebab log={log} />
        </Box>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
