import { Box, Chip, TableCell, TableRow } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import { AttributeResponse } from 'utils/types'
import React from 'react'
import getContrastYIQ from 'utils/getContrastYIQ'
import AttributeListItemKebab from 'components/AttributeList/AttributeListItemKebab'

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
      </TableCell>
      <TableCell>
        <CircleIcon sx={{ color: attribute.color }} />
      </TableCell>
      <TableCell sx={{ width: '10px' }}>
        <Box sx={{ flexGrow: 0, ml: 'auto' }}>
          <AttributeListItemKebab attribute={attribute} />
        </Box>
      </TableCell>
    </TableRow>
  )
}
