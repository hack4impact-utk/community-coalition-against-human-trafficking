import {
  Chip,
  Divider,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { AttributeResponse, ItemDefinitionResponse } from 'utils/types'
import getContrastYIQ from 'utils/getContrastYIQ'
import ItemDefinitionListItemKebab from 'components/ItemDefinitionList/ItemDefinitionListItemKebab'

interface Props {
  itemDefinition: ItemDefinitionResponse
}

const renderAttributeChips = (attributes?: AttributeResponse[]) => {
  return (
    <Stack direction="row" spacing={1}>
      {attributes?.map((attribute) => {
        return (
          <Chip
            size="small"
            label={attribute.name}
            key={attribute._id}
            sx={{
              backgroundColor: attribute.color,
              color: getContrastYIQ(attribute.color),
            }}
          />
        )
      })}
    </Stack>
  )
}

export default function MobileItemDefinitionListItem({
  itemDefinition,
}: Props) {
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
            {itemDefinition.name}
          </Typography>
        }
        secondary={
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            sx={{ display: 'block' }}
          >
            <Stack direction="column" spacing={1}>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={1}
              >
                <Typography>
                  Low quantity: {itemDefinition.lowStockThreshold}
                </Typography>
                <Typography>
                  Critically low quantity:{' '}
                  {itemDefinition.criticalStockThreshold}
                </Typography>
              </Stack>
              {renderAttributeChips(itemDefinition.attributes)}
            </Stack>
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <ItemDefinitionListItemKebab />
      </ListItemSecondaryAction>
    </ListItem>
  )
}
