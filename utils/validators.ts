import { Property, validateProperties } from 'utils/validation'
import deepCopy from './deepCopy'

/**
 * Checks the validity of an Attribute object. Does not validate child objects.
 * @param attribute The Attribute object to test
 * @returns A ValidationResult object
 */
export function validateAttributeRequest(
  attribute: Record<string, unknown>,
  requestType?: 'POST' | 'PUT'
) {
  let validationModel: Property[]
  if (requestType === 'PUT') {
    validationModel = attributePutModelProperties
  } else if (requestType === 'POST') {
    validationModel = attributePostModelProperties
  } else {
    validationModel = attributeRequestModelProperties
  }

  return validateProperties(validationModel, attribute)
}

/**
 * Checks the validity of an Category object. Does not validate child objects.
 * @param category The Category object to test
 * @returns A ValidationResult object
 */
export function validateCategoryRequest(
  category: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  let validationModel: Property[]
  if (requestType === 'PUT') {
    validationModel = categoryPutModelProperties
  } else if (requestType === 'POST') {
    validationModel = categoryPostModelProperties
  } else {
    validationModel = categoryRequestModelProperties
  }

  return validateProperties(validationModel, category)
}

/**
 * Checks the validity of an ItemDefinition object. Does not validate child objects.
 * @param itemDefinition The ItemDefinition object to test
 * @returns A ValidationResult object
 */
export function validateItemDefinitionRequest(
  itemDefinition: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  let validationModel: Property[]
  if (requestType === 'PUT') {
    validationModel = itemDefinitionPutModelProperties
  } else if (requestType === 'POST') {
    validationModel = itemDefinitionPostModelProperties
  } else {
    validationModel = itemDefinitionRequestModelProperties
  }

  return validateProperties(validationModel, itemDefinition)
}

/**
 * Checks the validity of an InventoryItem object. Does not validate child objects.
 * @param inventoryItem The InventoryItem object to test
 * @returns A ValidationResult object
 */
export function validateInventoryItemRequest(
  inventoryItem: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  let validationModel: Property[]
  if (requestType === 'PUT') {
    validationModel = inventoryItemPutModelProperties
  } else if (requestType === 'POST') {
    validationModel = inventoryItemPostModelProperties
  } else {
    validationModel = inventoryItemRequestModelProperties
  }

  return validateProperties(validationModel, inventoryItem)
}

/**
 * Checks the validity of an User object. Does not validate child objects.
 * @param user The User object to test
 * @returns A ValidationResult object
 */
export function validateUserRequest(
  user: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  let validationModel: Property[]
  if (requestType === 'PUT') {
    validationModel = userPostModelProperties
  } else if (requestType === 'POST') {
    validationModel = userPutModelProperties
  } else {
    validationModel = userRequestModelProperties
  }

  return validateProperties(validationModel, user)
}

/*
 * Since typescript is compiled into javascript on runtime, all type information
 * is lost. This makes it exceedingly difficult to have a truly generic object
 * validator. Hence, we must define what makes a valid object down here.
 * This operates similar to how the Schema definitions do, but just in a
 * slightly different format.
 */

export const attributeRequestModelProperties: Property[] = [
  {
    key: '_id',
    types: 'string',
    required: false,
  },
  {
    key: 'name',
    types: 'string',
    required: true,
  },
  {
    key: 'possibleValues',
    types: 'string|object',
    required: true,
  },
  {
    key: 'color',
    types: 'string',
    required: true,
  },
]

export const attributePostModelProperties: Property[] = deepCopy(
  attributeRequestModelProperties
)

export const attributePutModelProperties: Property[] = deepCopy(
  attributeRequestModelProperties
)
attributePutModelProperties.find((prop) => prop.key === '_id')!.required = true

export const categoryRequestModelProperties: Property[] = [
  {
    key: '_id',
    types: 'string',
    required: false,
  },
  {
    key: 'name',
    types: 'string',
    required: true,
  },
]

export const categoryPostModelProperties: Property[] = deepCopy(
  categoryRequestModelProperties
)

export const categoryPutModelProperties: Property[] = deepCopy(
  categoryPostModelProperties
)

categoryPutModelProperties.find((prop) => prop.key === '_id')!.required = true

export const itemDefinitionRequestModelProperties: Property[] = [
  {
    key: '_id',
    types: 'string',
    required: false,
  },
  {
    key: 'name',
    types: 'string',
    required: true,
  },
  {
    key: 'category',
    types: 'string',
    required: false,
  },
  {
    key: 'attributes',
    types: 'object',
    required: false,
  },
  {
    key: 'internal',
    types: 'boolean',
    required: true,
  },
  {
    key: 'lowStockThreshold',
    types: 'number',
    required: true,
  },
  {
    key: 'criticalStockThreshold',
    types: 'number',
    required: true,
  },
]

export const itemDefinitionPostModelProperties: Property[] = deepCopy(
  itemDefinitionRequestModelProperties
)

export const itemDefinitionPutModelProperties: Property[] = deepCopy(
  itemDefinitionRequestModelProperties
)
itemDefinitionPutModelProperties.find((prop) => prop.key === '_id')!.required =
  true

export const inventoryItemRequestModelProperties: Property[] = [
  {
    key: '_id',
    types: 'string',
    required: false,
  },
  {
    key: 'itemDefinition',
    types: 'string',
    required: true,
  },
  {
    key: 'attributes',
    types: 'object',
    required: false,
  },
  {
    key: 'quantity',
    types: 'number',
    required: true,
  },
  {
    key: 'assignee',
    types: 'string',
    required: true,
  },
]

export const inventoryItemPostModelProperties: Property[] = deepCopy(
  inventoryItemRequestModelProperties
)

export const inventoryItemPutModelProperties: Property[] = deepCopy(
  inventoryItemRequestModelProperties
)
inventoryItemPutModelProperties.find((prop) => prop.key === '_id')!.required =
  true

export const userRequestModelProperties: Property[] = [
  {
    key: '_id',
    types: 'string',
    required: false,
  },
  {
    key: 'name',
    types: 'string',
    required: true,
  },
  {
    key: 'email',
    types: 'string',
    required: true,
  },
  {
    key: 'image',
    types: 'string',
    required: true,
  },
]

export const userPostModelProperties: Property[] = [
  ...userRequestModelProperties,
]

export const userPutModelProperties: Property[] = [
  ...userRequestModelProperties,
]
userPutModelProperties.find((prop) => prop.key === '_id')!.required = true
