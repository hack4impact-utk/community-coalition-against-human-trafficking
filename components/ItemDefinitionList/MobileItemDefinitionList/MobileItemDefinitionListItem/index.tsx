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
import theme from 'utils/theme'
import ItemDefinitionListItemKebab from 'components/ItemDefinitionList/ItemDefinitionListItemKebab'
import React from 'react'
import { useAppSelector } from 'store'
import { sortAttributes } from 'utils/sortAttributes'

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
  const rowSpacing = 1
  const { defaultAttributes } = useAppSelector((state) => state.config)
  const sortedAttributes = React.useMemo(() => {
    return sortAttributes(itemDefinition.attributes, defaultAttributes)
  }, [itemDefinition.attributes, defaultAttributes])

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
            sx={{ display: 'block', mt: theme.spacing(rowSpacing) }}
          >
            <Stack direction="column" spacing={rowSpacing}>
              {renderAttributeChips(sortedAttributes)}
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={1}
              >
                <Typography color={theme.palette.warning.main}>
                  {itemDefinition.lowStockThreshold}
                </Typography>
                <Typography color={theme.palette.error.main}>
                  {itemDefinition.criticalStockThreshold}
                </Typography>
              </Stack>
            </Stack>
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <ItemDefinitionListItemKebab itemDefinition={itemDefinition} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}
