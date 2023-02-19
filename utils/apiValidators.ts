import { ApiError } from './types'
import {
  validateAttribute,
  validateCategory,
  validateItemDefinition,
  validateObjectId,
  validateUser,
  ValidationResult,
} from './validators'

const BAD_REQUEST_BODY_PREFIX = 'Bad Request Body: '

export function apiObjectIdValidation(id: any) {
  if (!validateObjectId(id)) {
    throw new ApiError(400, 'Invalid ObjectId Format')
  }
}

export function apiAttributeValidation(attribute: any) {
  let response = validateAttribute(attribute)
  badBodyValidationResponse(response)
}

export function apiCategoryValidation(category: any) {
  let response = validateCategory(category)
  badBodyValidationResponse(response)
}

export function apiItemDefinitionValidation(itemDefinition: any) {
  let response = validateItemDefinition(itemDefinition)
  badBodyValidationResponse(response)
}

export function apiUserValidation(user: any) {
  let response = validateUser(user)
  badBodyValidationResponse(response)
}

function badBodyValidationResponse(response: ValidationResult) {
  if (!response.success) {
    throw new ApiError(400, BAD_REQUEST_BODY_PREFIX + response.message)
  }
}
