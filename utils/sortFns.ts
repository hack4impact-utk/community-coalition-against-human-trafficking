import { AttributeResponse, InventoryItemAttributeResponse } from 'utils/types'

export function stringPropertyCompareFn<T>(
  propertyPath: string,
  reverse = false
): (a: T, b: T) => number {
  const stringCompare = stringCompareFn(reverse)

  return (a: T, b: T) => {
    const val1 = getProperty(a, propertyPath)
    const val2 = getProperty(b, propertyPath)
    return stringCompare(val1, val2)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getProperty(obj: any, propertyPath: string): any {
  const properties = propertyPath.split('.')
  let value = obj
  for (const prop of properties) {
    if (value.hasOwnProperty(prop)) {
      value = value[prop]
    } else {
      return undefined
    }
  }
  return value
}

export function stringCompareFn(
  reverse = false
): (a: string, b: string) => number {
  return (a: string, b: string) => {
    const val1 = a.toLowerCase()
    const val2 = b.toLowerCase()
    if (val1 < val2) {
      return reverse ? 1 : -1
    }
    if (val1 > val2) {
      return reverse ? -1 : 1
    }
    return 0
  }
}

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
