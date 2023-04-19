import * as validation from 'utils/validation'
import {
  apiObjectIdValidation,
  apiAttributeValidation,
  apiCategoryValidation,
  apiItemDefinitionValidation,
  apiUserValidation,
  apiLogValidation,
} from 'utils/apiValidators'
import * as validators from 'utils/validators'
import { ApiError } from 'utils/types'
import constants from 'utils/constants'

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
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe(constants.errors.invalidObjectIdFormat)
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
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe(
          constants.errors.prefixes.badBody + validationFailedReturn.message
        )
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
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe(
          constants.errors.prefixes.badBody + validationFailedReturn.message
        )
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
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe(
          constants.errors.prefixes.badBody + validationFailedReturn.message
        )
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
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe(
          constants.errors.prefixes.badBody + validationFailedReturn.message
        )
      }
    })
  })

  describe('apiLogValidation', () => {
    test('validation success', () => {
      jest
        .spyOn(validators, 'validateLogRequest')
        .mockReturnValue(validationSuccessReturn)
      try {
        apiLogValidation({}, 'POST')
      } catch (e) {
        fail('should not have thrown an error: ' + e.message)
      }
    })

    test('validation failed throws api error', () => {
      jest
        .spyOn(validators, 'validateLogRequest')
        .mockReturnValue(validationFailedReturn)
      try {
        apiLogValidation({}, 'POST')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe(
          constants.errors.prefixes.badBody + validationFailedReturn.message
        )
      }
    })
  })
})
