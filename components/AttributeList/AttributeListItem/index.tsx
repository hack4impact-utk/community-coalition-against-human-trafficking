import { Box, Chip, TableCell, TableRow } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import { AttributeResponse } from 'utils/types'
import AttributeListItemKebab from '../AttributeListItemKebab'

interface AttributeListItemProps {
  attribute: AttributeResponse
  setSelectedAttribute: (attribute: AttributeResponse) => void
  setDialogOpen: (bool: boolean) => void
}

export default function AttributeListItem({
  attribute,
  setSelectedAttribute,
  setDialogOpen,
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
          : attribute.possibleValues.charAt(0).toUpperCase() +
            attribute.possibleValues.slice(1)}
      </TableCell>
      <TableCell>
        <CircleIcon sx={{ color: attribute.color }} />
      </TableCell>
      <TableCell sx={{ width: '10px' }}>
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <AttributeListItemKebab
            attribute={attribute}
            setSelectedAttribute={setSelectedAttribute}
            setDialogOpen={setDialogOpen}
          />
        </Box>
      </TableCell>
    </TableRow>
  )
}
