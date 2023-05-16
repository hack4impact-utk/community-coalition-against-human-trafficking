import { Chip } from '@mui/material'
import { useAppSelector } from 'store'
import getContrastYIQ from './getContrastYIQ'
import { InventoryItemAttributeResponse } from './types'

const attributeComparator = (
  a: InventoryItemAttributeResponse,
  b: InventoryItemAttributeResponse
) => {
  const aName = a.attribute.name.toLowerCase()
  const bName = b.attribute.name.toLowerCase()
  if (aName < bName) {
    return -1
  }
  if (aName > bName) {
    return 1
  }
  return 0
}

const RenderAttributeChips = (
  attributes?: InventoryItemAttributeResponse[]
) => {
  const config = useAppSelector((state) => state.config)
  const defaultAttrs = config.defaultAttributes
  // console.log(defaultAttrs)
  if (!attributes) {
    return null
  }

  attributes.sort(attributeComparator)
  // first get all the default attributes
  // then get all the rest
  const defaults: InventoryItemAttributeResponse[] = []
  const nonDefaults: InventoryItemAttributeResponse[] = []
  attributes.forEach((attr) => {
    if (
      defaultAttrs?.find(
        (defaultAttr) => defaultAttr._id === attr.attribute._id
      )
    ) {
      defaults.push(attr)
    } else {
      nonDefaults.push(attr)
    }
  })

  const sortedAttrs = [...defaults, ...nonDefaults]

  // const sortedAttributes: InventoryItemAttributeResponse[] = []
  // const defaultSortedAttrs = attributes
  //   .filter((attr) =>
  //     defaultAttrs?.find((defaultAttr) => {
  //       return defaultAttr._id === attr.attribute._id
  //     })
  //   )
  //   .sort(attributeComparator)

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
