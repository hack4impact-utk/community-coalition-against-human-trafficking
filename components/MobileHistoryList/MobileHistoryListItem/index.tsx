import {
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Box,
  ListItemSecondaryAction,
  Avatar,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import HistoryListItemKebab from 'components/DesktopHistoryList/HistoryListItemKebab'
import getContrastYIQ from 'utils/getContrastYIQ'
import { LogResponse } from 'utils/types'

interface Props {
  log: LogResponse
}

function renderAttributeChips(log: LogResponse) {
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
              <Grid2 md={12} lg={4}>
                {log.item.itemDefinition.name}
              </Grid2>
              <Grid2 md={12} lg={8}>
                <Box>{renderAttributeChips(log)}</Box>
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
