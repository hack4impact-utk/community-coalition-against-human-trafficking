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
    validationModel = userPutModelProperties
  } else if (requestType === 'POST') {
    validationModel = userPostModelProperties
  } else {
    validationModel = userRequestModelProperties
  }

  return validateProperties(validationModel, user)
}

/**
 * Checks the validity of an Log object. Does not validate child objects.
 * @param log The Log object to test
 * @returns A ValidationResult object
 */
export function validateLogRequest(
  log: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  let validationModel: Property[]
  if (requestType === 'PUT') {
    validationModel = logPutModelProperties
  } else if (requestType === 'POST') {
    validationModel = logPostModelProperties
  } else {
    validationModel = logRequestModelProperties
  }

  return validateProperties(validationModel, log)
}

/**
 * Checks the validity of an appConfig object. Does not validate child objects.
 * @param appConfig The AppConfig object to test
 * @returns A ValidationResult object
 */
export function validateAppConfigRequest(
  appConfig: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  let validationModel: Property[]
  if (requestType === 'PUT') {
    validationModel = appConfigPutModelProperties
  } else if (requestType === 'POST') {
    validationModel = appConfigPostModelProperties
  } else {
    validationModel = appConfigRequestModelProperties
  }
  return validateProperties(validationModel, appConfig)
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
    required: true,
  },
  {
    key: 'internal',
    types: 'boolean',
    required: true,
  },
  {
    key: 'lowStockThreshold',
    types: 'number',
    required: false,
  },
  {
    key: 'criticalStockThreshold',
    types: 'number',
    required: false,
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
    required: false,
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

export const userPostModelProperties: Property[] = deepCopy(
  userRequestModelProperties
)

export const userPutModelProperties: Property[] = deepCopy(
  userRequestModelProperties
)
userPutModelProperties.find((prop) => prop.key === '_id')!.required = true

export const logRequestModelProperties: Property[] = [
  {
    key: '_id',
    types: 'string',
    required: false,
  },
  {
    key: 'staff',
    types: 'string',
    required: true,
  },
  {
    key: 'item',
    types: 'string',
    required: true,
  },
  {
    key: 'quantityDelta',
    types: 'number',
    required: true,
  },
  {
    key: 'date',
    types: 'string',
    required: true,
  },
]

export const logPostModelProperties: Property[] = deepCopy(
  logRequestModelProperties
)

export const logPutModelProperties: Property[] = deepCopy(
  logRequestModelProperties
)
logPutModelProperties.find((prop) => prop.key === '_id')!.required = true

export const appConfigRequestModelProperties: Property[] = [
  {
    key: '_id',
    types: 'string',
    required: false,
  },
  {
    key: 'emails',
    types: 'object',
    required: true,
  },
  {
    key: 'defaultAttributes',
    types: 'object',
    required: true,
  },
]
export const appConfigPostModelProperties: Property[] = deepCopy(
  appConfigRequestModelProperties
)

export const appConfigPutModelProperties: Property[] = deepCopy(
  appConfigRequestModelProperties
)
appConfigPutModelProperties.find((prop) => prop.key === '_id')!.required = true
