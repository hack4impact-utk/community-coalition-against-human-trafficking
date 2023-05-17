import { AttributeResponse, InventoryItemAttributeResponse } from './types'

const itemAttributeComparator = (
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

const attributeComparator = (a: AttributeResponse, b: AttributeResponse) => {
  const aName = a.name.toLowerCase()
  const bName = b.name.toLowerCase()
  if (aName < bName) {
    return -1
  }
  if (aName > bName) {
    return 1
  }
  return 0
}

export function sortItemAttributes(
  attributes: InventoryItemAttributeResponse[],
  defaultAttrs?: AttributeResponse[]
) {
  attributes.sort(itemAttributeComparator)
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

  return [...defaults, ...nonDefaults]
}

export function sortAttributes(
  attributes: AttributeResponse[],
  defaultAttrs?: AttributeResponse[]
) {
  attributes.sort(attributeComparator)

  const defaults: AttributeResponse[] = []
  const nonDefaults: AttributeResponse[] = []

  attributes.forEach((attr) => {
    if (defaultAttrs?.find((defaultAttr) => defaultAttr._id === attr._id)) {
      defaults.push(attr)
    } else {
      nonDefaults.push(attr)
    }
  })

  return [...defaults, ...nonDefaults]
}
