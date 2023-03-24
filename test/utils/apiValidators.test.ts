import * as validation from 'utils/validation'
import {
  apiObjectIdValidation,
  apiAttributeValidation,
  BAD_REQUEST_BODY_PREFIX,
  apiCategoryValidation,
  apiItemDefinitionValidation,
  apiUserValidation,
} from 'utils/apiValidators'
import * as validators from 'utils/validators'
import { ApiError } from 'utils/types'

describe('apiValidators', () => {
  const validationFailedReturn = {
    success: false,
    message: 'Validation Failed',
  }

  const validationSuccessReturn = {
    success: true,
    message: '',
  }

  describe('apiValidateObjectId', () => {
    test('invalid object id throws api error', () => {
      jest.spyOn(validation, 'validateObjectId').mockReturnValue(false)
      try {
        apiObjectIdValidation('3')
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(400)
      }
    })
  })

  describe('apiAttributeValidation', () => {
    test('validation success', () => {
      jest
        .spyOn(validators, 'validateAttributeRequest')
        .mockReturnValue(validationSuccessReturn)
      try {
        apiAttributeValidation({}, 'POST')
      } catch (e) {
        fail('should not have thrown an error: ' + e.message)
      }
    })

    test('validation failed throws api error', () => {
      jest
        .spyOn(validators, 'validateAttributeRequest')
        .mockReturnValue(validationFailedReturn)
      try {
        apiAttributeValidation({}, 'POST')
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(400)
        expect(err.message).toBe(BAD_REQUEST_BODY_PREFIX + 'Validation Failed')
      }
    })
  })

  describe('apiCategoryValidation', () => {
    test('validation success', () => {
      jest
        .spyOn(validators, 'validateCategoryRequest')
        .mockReturnValue(validationSuccessReturn)
      try {
        apiCategoryValidation({}, 'POST')
      } catch (e) {
        fail('should not have thrown an error: ' + e.message)
      }
    })

    test('validation failed throws api error', () => {
      jest
        .spyOn(validators, 'validateCategoryRequest')
        .mockReturnValue(validationFailedReturn)
      try {
        apiCategoryValidation({}, 'POST')
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(400)
        expect(err.message).toBe(BAD_REQUEST_BODY_PREFIX + 'Validation Failed')
      }
    })
  })

  describe('apiItemDefinitionValidation', () => {
    test('validation success', () => {
      jest
        .spyOn(validators, 'validateItemDefinitionRequest')
        .mockReturnValue(validationSuccessReturn)
      try {
        apiItemDefinitionValidation({}, 'POST')
      } catch (e) {
        fail('should not have thrown an error: ' + e.message)
      }
    })

    test('validation failed throws api error', () => {
      jest
        .spyOn(validators, 'validateItemDefinitionRequest')
        .mockReturnValue(validationFailedReturn)
      try {
        apiItemDefinitionValidation({}, 'POST')
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(400)
        expect(err.message).toBe(BAD_REQUEST_BODY_PREFIX + 'Validation Failed')
      }
    })
  })

  describe('apiUserValidation', () => {
    test('validation success', () => {
      jest
        .spyOn(validators, 'validateUserRequest')
        .mockReturnValue(validationSuccessReturn)
      try {
        apiUserValidation({}, 'POST')
      } catch (e) {
        fail('should not have thrown an error: ' + e.message)
      }
    })

    test('validation failed throws api error', () => {
      jest
        .spyOn(validators, 'validateUserRequest')
        .mockReturnValue(validationFailedReturn)
      try {
        apiUserValidation({}, 'POST')
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(400)
        expect(err.message).toBe(BAD_REQUEST_BODY_PREFIX + 'Validation Failed')
      }
    })
  })
})
