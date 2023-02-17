import { ApiError } from './types'
import {
  validateAttribute,
  validateCategory,
  validateItemDefinition,
  validateObjectId,
  validateUser,
} from './validators'

const BAD_REQUEST_BODY_MESSAGE = 'Bad Request Body'

export function apiRequestValidation(req: any) {
  if (!req || !req.query) {
    throw new ApiError(400, 'Bad Request')
  }
}

export function apiObjectIdValidation(id: any) {
  if (!validateObjectId(id)) {
    throw new ApiError(400, 'Invalid ObjectId Format')
  }
}

export function apiAttributeValidation(attribute: any) {
  if (!validateAttribute(attribute)) {
    throw new ApiError(400, BAD_REQUEST_BODY_MESSAGE)
  }
}

export function apiCategoryValidation(category: any) {
  if (!validateCategory(category)) {
    throw new ApiError(400, BAD_REQUEST_BODY_MESSAGE)
  }
}

export function apiItemDefinitionValidation(itemDefinition: any) {
  if (!validateItemDefinition(itemDefinition)) {
    throw new ApiError(400, BAD_REQUEST_BODY_MESSAGE)
  }
}

export function apiUserValidation(user: any) {
  if (!validateUser(user)) {
    throw new ApiError(400, BAD_REQUEST_BODY_MESSAGE)
  }
}
