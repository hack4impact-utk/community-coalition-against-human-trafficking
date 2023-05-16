import { ApiError } from 'utils/types'
import {
  validateAttributeRequest,
  validateCategoryRequest,
  validateInventoryItemRequest,
  validateItemDefinitionRequest,
  validateLogRequest,
  validateAppConfigRequest,
  validateUserRequest,
} from 'utils/validators'
import { validateObjectId, ValidationResult } from 'utils/validation'
import { errors } from 'utils/constants/errors'

export function apiObjectIdValidation(id: string) {
  if (!validateObjectId(id)) {
    throw new ApiError(400, errors.invalidObjectIdFormat)
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
  inventoryItem: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  const response = validateInventoryItemRequest(inventoryItem, requestType)
  badBodyValidationResponse(response)
}

export function apiLogValidation(
  log: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  const response = validateLogRequest(log, requestType)
  badBodyValidationResponse(response)
}

export function apiAppConfigValidation(
  notificationEmail: Record<string, unknown>,
  requestType?: 'PUT' | 'POST'
) {
  const response = validateAppConfigRequest(notificationEmail, requestType)
  badBodyValidationResponse(response)
}

function badBodyValidationResponse(response: ValidationResult) {
  if (!response.success) {
    console.error(errors.prefixes.badBody + response.message)
    throw new ApiError(400, errors.prefixes.badBody + response.message)
  }
}
