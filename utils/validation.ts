import { ObjectId } from 'mongodb'
import constants from 'utils/constants'

export interface Property {
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
 * Validates a given id to ensure it is a valid ObjectId. Throws an error if invalid.
 * @param id - The ObjectId to validate
 * @returns true if the objectId was valid, false if not
 */
export function validateObjectId(id: string) {
  if (!id) return false
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) !== id) return false
    return true
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
export function validateProperties(
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
    {
      errorName: constants.errors.prefixes.missingRequiredProperties,
      errors: missingProperties,
    },
    {
      errorName: constants.errors.prefixes.invalidProperties,
      errors: invalidProperties,
    },
    {
      errorName: constants.errors.prefixes.typeMismatches,
      errors: typeMismatches,
    },
  ]

  if (typeof obj !== 'object') {
    result.message = 'Validation target is not an instance of an object.'
    result.success = false
    return result
  }

  // ensures all required properties are present
  const isValidObject = true
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
    const i = modelProperties.findIndex((prop) => prop.key === objKey)

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
  return result
}
