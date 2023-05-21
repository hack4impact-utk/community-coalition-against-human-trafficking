import { Chip } from '@mui/material'
import React from 'react'
import { useAppSelector } from 'store'
import getContrastYIQ from './getContrastYIQ'
import { sortItemAttributes } from './sortAttributes'
import { InventoryItemAttributeResponse } from './types'

const RenderAttributeChips = (
  attributes?: InventoryItemAttributeResponse[]
) => {
  const config = useAppSelector((state) => state.config)
  const defaultAttrs = config.defaultAttributes

  const sortedAttrs = React.useMemo(
    () => sortItemAttributes(attributes || [], defaultAttrs),
    [attributes, defaultAttrs]
  )

  if (!attributes?.length) {
    return '-'
  }

  return sortedAttrs.map((itemAttribute, i) => {
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
          mr: 1,
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

export default RenderAttributeChips
