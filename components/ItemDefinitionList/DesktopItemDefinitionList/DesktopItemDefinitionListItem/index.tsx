import { AttributeResponse, ItemDefinitionResponse } from 'utils/types'
import { Chip, Stack, TableCell, TableRow, Typography } from '@mui/material'
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

export default function DesktopItemDefinitionListItem({
  itemDefinition,
}: Props) {
  return (
    <TableRow>
      <TableCell>{itemDefinition.name}</TableCell>
      <TableCell>{renderAttributeChips(itemDefinition.attributes)}</TableCell>
      <TableCell>{itemDefinition.category?.name}</TableCell>
      <TableCell>{itemDefinition.internal ? 'Staff' : 'Clients'}</TableCell>
      <TableCell>
        <Stack direction="column">
          <Typography variant="body1">
            {itemDefinition.lowStockThreshold}
          </Typography>
          <Typography variant="body1">
            {itemDefinition.criticalStockThreshold}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <ItemDefinitionListItemKebab itemDefinition={itemDefinition} />
      </TableCell>
    </TableRow>
  )
}
