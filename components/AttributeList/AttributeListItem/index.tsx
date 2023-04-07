import { Box, Chip, TableCell, TableRow } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import { AttributeResponse } from 'utils/types'
import AttributeListItemKebab from '../AttributeListItemKebab'

interface AttributeListItemProps {
  attribute: AttributeResponse
}

export default function AttributeListItem({
  attribute,
}: AttributeListItemProps) {
  return (
    <TableRow>
      <TableCell>{attribute.name}</TableCell>
      <TableCell>
        {typeof attribute.possibleValues === 'object'
          ? attribute.possibleValues.map((possibleValue, index) => (
              <Chip
                size="small"
                label={possibleValue}
                key={`${possibleValue}-${index}`}
              />
            ))
          : attribute.possibleValues}
      </TableCell>
      <TableCell>
        <CircleIcon sx={{ color: attribute.color }} />
      </TableCell>
      <TableCell sx={{ width: '10px' }}>
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <AttributeListItemKebab
            attribute={attribute}
          />
        </Box>
      </TableCell>
    </TableRow>
  )
}
