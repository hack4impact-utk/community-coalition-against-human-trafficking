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
export function validateAttribute(attribute: Record<string, unknown>) {
  return validateProperties(attributeModelProperties, attribute)
}

/**
 * Checks the validity of an Category object. Does not validate child objects.
 * @param category The Category object to test
 * @returns A ValidationResult object
 */
export function validateCategory(category: Record<string, unknown>) {
  return validateProperties(categoryModelProperties, category)
}

/**
 * Checks the validity of an ItemDefinition object. Does not validate child objects.
 * @param itemDefinition The ItemDefinition object to test
 * @returns A ValidationResult object
 */
export function validateItemDefinition(
  itemDefinition: Record<string, unknown>
) {
  return validateProperties(itemDefinitionModelProperties, itemDefinition)
}

/**
 * Checks the validity of an InventoryItem object. Does not validate child objects.
 * @param inventoryItem The InventoryItem object to test
 * @returns A ValidationResult object
 */
export function validateInventoryItem(inventoryItem: Record<string, unknown>) {
  return validateProperties(inventoryItemModelProperties, inventoryItem)
}

/**
 * Checks the validity of an User object. Does not validate child objects.
 * @param user The User object to test
 * @returns A ValidationResult object
 */
export function validateUser(user: Record<string, unknown>) {
  return validateProperties(userModelProperties, user)
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

const attributeModelProperties: Property[] = [
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

const categoryModelProperties: Property[] = [
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

const itemDefinitionModelProperties: Property[] = [
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
    types: 'string|object',
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

const inventoryItemModelProperties: Property[] = [
  {
    key: '_id',
    types: 'string',
    required: false,
  },
  {
    key: 'itemDefinition',
    types: 'string|object',
    required: true,
  },
  {
    key: 'itemDefinition',
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
    types: 'string|object',
    required: true,
  },
]

const userModelProperties: Property[] = [
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
