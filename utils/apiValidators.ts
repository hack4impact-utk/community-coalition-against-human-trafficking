import { ApiError } from 'utils/types'
import {
  validateAttributeRequest,
  validateCategoryRequest,
  validateInventoryItemRequest,
  validateItemDefinitionRequest,
  validateUserRequest,
} from 'utils/validators'
import { validateObjectId, ValidationResult } from 'utils/validation'

export const BAD_REQUEST_BODY_PREFIX = 'Bad Request Body:\n'

export function apiObjectIdValidation(id: string) {
  if (!validateObjectId(id)) {
    throw new ApiError(400, 'Invalid ObjectId Format')
  }
}

export function apiAttributeValidation(
  attribute: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  const response = validateAttributeRequest(attribute, requestType)
  badBodyValidationResponse(response)
}

export function apiCategoryValidation(
  category: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  const response = validateCategoryRequest(category, requestType)
  badBodyValidationResponse(response)
}

export function apiItemDefinitionValidation(
  itemDefinition: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  const response = validateItemDefinitionRequest(itemDefinition, requestType)
  badBodyValidationResponse(response)
}

export function apiUserValidation(
  user: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  const response = validateUserRequest(user, requestType)
  badBodyValidationResponse(response)
}

export function apiInventoryItemValidation(
  inventoryItem: Record<string, unknown>
) {
  const response = validateInventoryItemRequest(inventoryItem)
  badBodyValidationResponse(response)
}

function badBodyValidationResponse(response: ValidationResult) {
  if (!response.success) {
    console.log(BAD_REQUEST_BODY_PREFIX + response.message)
    throw new ApiError(400, BAD_REQUEST_BODY_PREFIX + response.message)
  }
}
