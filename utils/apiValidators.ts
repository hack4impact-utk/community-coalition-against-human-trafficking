import { ApiError } from 'utils/types'
import {
  validateAttribute,
  validateCategory,
  validateItemDefinition,
  validateObjectId,
  validateUser,
  ValidationResult,
} from 'utils/validators'

const BAD_REQUEST_BODY_PREFIX = 'Bad Request Body:\n'

export function apiObjectIdValidation(id: string) {
  if (!validateObjectId(id)) {
    throw new ApiError(400, 'Invalid ObjectId Format')
  }
}

export function apiAttributeValidation(attribute: Record<string, unknown>) {
  const response = validateAttribute(attribute)
  badBodyValidationResponse(response)
}

export function apiCategoryValidation(category: Record<string, unknown>) {
  const response = validateCategory(category)
  badBodyValidationResponse(response)
}

export function apiItemDefinitionValidation(
  itemDefinition: Record<string, unknown>
) {
  const response = validateItemDefinition(itemDefinition)
  badBodyValidationResponse(response)
}

export function apiUserValidation(user: Record<string, unknown>) {
  const response = validateUser(user)
  badBodyValidationResponse(response)
}

function badBodyValidationResponse(response: ValidationResult) {
  if (!response.success) {
    console.log(BAD_REQUEST_BODY_PREFIX + response.message)
    throw new ApiError(400, BAD_REQUEST_BODY_PREFIX + response.message)
  }
}
