import { ApiError } from './types'
import {
  validateAttribute,
  validateCategory,
  validateItemDefinition,
  validateObjectId,
  validateUser,
} from './validators'

const BAD_REQUEST_BODY_PREFIX = 'Bad Request Body: '

export function apiObjectIdValidation(id: any) {
  if (!validateObjectId(id)) {
    throw new ApiError(400, 'Invalid ObjectId Format')
  }
}

export function apiAttributeValidation(attribute: any) {
  let response = validateAttribute(attribute)
  if (!response.success) {
    throw new ApiError(400, BAD_REQUEST_BODY_PREFIX + response.message)
  }
}

export function apiCategoryValidation(category: any) {
  let response = validateCategory(category)
  if (!response.success) {
    throw new ApiError(400, BAD_REQUEST_BODY_PREFIX + response.message)
  }
}

export function apiItemDefinitionValidation(itemDefinition: any) {
  let response = validateItemDefinition(itemDefinition)
  if (!response.success) {
    throw new ApiError(400, BAD_REQUEST_BODY_PREFIX + response.message)
  }
}

export function apiUserValidation(user: any) {
  let response = validateUser(user)
  if (!response.success) {
    throw new ApiError(400, BAD_REQUEST_BODY_PREFIX + response.message)
  }
}
