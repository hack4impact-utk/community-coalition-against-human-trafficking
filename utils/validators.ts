import { ObjectId } from 'mongodb'

interface Property {
  key: string
  types: string
  required: boolean
}

export interface ValidationResult {
  success: boolean
  message: string
}

interface ValidationErrorList {
  errorName: string
  errors: string[]
}

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
    validationModel = attributePostModelProperties
  } else if (requestType === 'POST') {
    validationModel = attributePutModelProperties
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
    validationModel = categoryPostModelProperties
  } else if (requestType === 'POST') {
    validationModel = categoryPutModelProperties
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
    validationModel = itemDefinitionPostModelProperties
  } else if (requestType === 'POST') {
    validationModel = itemDefinitionPutModelProperties
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
    validationModel = inventoryItemPostModelProperties
  } else if (requestType === 'POST') {
    validationModel = inventoryItemPutModelProperties
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

/**
 * Validates a given id to ensure it is a valid ObjectId. Throws an error if invalid.
 * @param id - The ObjectId to validate
 * @returns true if the objectId was valid, false if not
 */
export function validateObjectId(id: string) {
  if (!id) return false
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true
  }
  return false
}

// TODO improve array validation using 'instanceof Array'
/**
 * Generic object validator that checks for required fields, extra fields, and type mismatches
 * @param modelProperties An array of Property objects
 * @param obj The object to validate
 * @returns A ValidationResult object
 */
function validateProperties(
  modelProperties: Property[],
  obj: Record<string, unknown>
): ValidationResult {
  const result: ValidationResult = {
    success: true,
    message: '',
  }

  const missingProperties: string[] = []
  const invalidProperties: string[] = []
  const typeMismatches: string[] = []
  const validationErrors: ValidationErrorList[] = [
    { errorName: 'Missing Required Properties:', errors: missingProperties },
    { errorName: 'Invalid Properties:', errors: invalidProperties },
    { errorName: 'Type Mismatches:', errors: typeMismatches },
  ]

  if (typeof obj !== 'object') {
    result.message = 'Validation target is not an instance of an object.'
    result.success = false
    return result
  }

  // ensures all required properties are present
  let isValidObject = true
  for (const modelProp of modelProperties) {
    if (
      isValidObject &&
      modelProp.required &&
      !obj.hasOwnProperty(modelProp.key)
    ) {
      missingProperties.push(modelProp.key)
    }
  }

  // checks validity of all object properties.
  for (const objKey in obj) {
    let i = modelProperties.findIndex((prop) => prop.key === objKey)

    // property is not part of server model
    if (i < 0) {
      invalidProperties.push(objKey)
      continue
    }

    // type mismatch
    if (!modelProperties[i].types.includes(typeof obj[objKey])) {
      typeMismatches.push(
        `'${objKey}': Expected type '${
          modelProperties[i].types
        }' but got type '${typeof obj[objKey]}'`
      )
    }
  }
  for (const errorList of validationErrors) {
    if (errorList.errors.length) {
      result.success = false
      result.message += errorList.errorName
      let firstError = true
      for (const error of errorList.errors) {
        if (!firstError) {
          result.message += ','
        }
        result.message += ` ${error}`
        firstError = false
      }
      result.message += '\n'
    }
  }
  console.log(result)
  return result
}

/*
 * Since typescript is compiled into javascript on runtime, all type information
 * is lost. This makes it exceedingly difficult to have a truly generic object
 * validator. Hence, we must define what makes a valid object down here.
 * This operates similar to how the Schema definitions do, but just in a
 * slightly different format.
 */

const attributeRequestModelProperties: Property[] = [
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

const attributePostModelProperties: Property[] = [
  ...attributeRequestModelProperties,
]

const attributePutModelProperties: Property[] = [
  ...attributeRequestModelProperties,
]
attributePutModelProperties.find((prop) => prop.key === '_id')!.required = true

const categoryRequestModelProperties: Property[] = [
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

const categoryPostModelProperties: Property[] = [
  ...categoryRequestModelProperties,
]

const categoryPutModelProperties: Property[] = [
  ...categoryRequestModelProperties,
]
categoryPutModelProperties.find((prop) => prop.key === '_id')!.required = true

const itemDefinitionRequestModelProperties: Property[] = [
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

const itemDefinitionPostModelProperties: Property[] = [
  ...itemDefinitionRequestModelProperties,
]

const itemDefinitionPutModelProperties: Property[] = [
  ...itemDefinitionRequestModelProperties,
]
itemDefinitionPutModelProperties.find((prop) => prop.key === '_id')!.required =
  true

const inventoryItemRequestModelProperties: Property[] = [
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
    key: 'itemDefinition',
    types: 'string',
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

const inventoryItemPostModelProperties: Property[] = [
  ...inventoryItemRequestModelProperties,
]

const inventoryItemPutModelProperties: Property[] = [
  ...inventoryItemRequestModelProperties,
]
inventoryItemPutModelProperties.find((prop) => prop.key === '_id')!.required =
  true

const userRequestModelProperties: Property[] = [
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

const userPostModelProperties: Property[] = [...userRequestModelProperties]

const userPutModelProperties: Property[] = [...userRequestModelProperties]
userPutModelProperties.find((prop) => prop.key === '_id')!.required = true
