import {
  Box,
  Chip,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material'
import { AttributeResponse } from 'utils/types'
import CircleIcon from '@mui/icons-material/Circle'
import getContrastYIQ from 'utils/getContrastYIQ'
import AttributeListItemKebab from 'components/AttributeList/AttributeListItemKebab'

interface MobileAttributeListItemProps {
  attribute: AttributeResponse
}

export default function MobileAttributeListItem({
  attribute,
}: MobileAttributeListItemProps) {
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
            {attribute.name}
          </Typography>
        }
        secondary={
          <Box sx={{ maxWidth: '80%', mt: 1 }}>
            {typeof attribute.possibleValues === 'object'
              ? attribute.possibleValues.map((possibleValue, index) => (
                  <Chip
                    size="small"
                    label={possibleValue}
                    key={`${possibleValue}-${index}`}
                    sx={{
                      mr: 1,
                      my: 0.5,
                      backgroundColor: attribute.color,
                      '& .MuiChip-label': {
                        color: getContrastYIQ(attribute.color),
                      },
                    }}
                  />
                ))
              : attribute.possibleValues.charAt(0).toUpperCase() +
                attribute.possibleValues.slice(1)}
          </Box>
        }
      />
      <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center' }}>
        <CircleIcon sx={{ color: attribute.color }} />
        <AttributeListItemKebab attribute={attribute} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}
