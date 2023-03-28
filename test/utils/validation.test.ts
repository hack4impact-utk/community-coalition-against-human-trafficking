import { ObjectId } from 'mongodb'
import {
  Property,
  validateObjectId,
  validateProperties,
} from 'utils/validation'
import constants from 'utils/constants'

describe('validation', () => {
  describe('validateObjectId', () => {
    test('valid id returns true', () => {
      const validObjectId = new ObjectId()
      const objectIdStr = validObjectId.toString()

      expect(validateObjectId(objectIdStr)).toBe(true)
    })

    test('empty string returns false', () => {
      expect(validateObjectId('')).toBe(false)
    })

    test('object id that gets transformed returns false', () => {
      const invalidObjectId = 'aaaabbbbcccc'

      // ensure the object id does get transformed and that it is not valid
      expect(new ObjectId(invalidObjectId).toString()).not.toBe(invalidObjectId)
      expect(validateObjectId(invalidObjectId)).toBe(false)
    })

    test('invalid object id returns false', () => {
      const invalidObjectId = '3'

      expect(validateObjectId(invalidObjectId)).toBe(false)
    })

    test('invalid 24-character object id returns false', () => {
      const invalidObjectId = '64222a68edd72b68ab2ae21z'

      expect(validateObjectId(invalidObjectId)).toBe(false)
    })
  })

  describe('validateProperties', () => {
    const validationModel: Property[] = [
      {
        key: 'name',
        types: 'string',
        required: true,
      },
      {
        key: 'id',
        types: 'string|number',
        required: true,
      },
      {
        key: 'optional',
        types: 'string',
        required: false,
      },
    ]

    test('valid object returns successful ValidationResult', () => {
      const validObject = {
        name: 'test',
        id: 3,
        optional: 'optional',
      }

      expect(validateProperties(validationModel, validObject)).toEqual({
        success: true,
        message: '',
      })
    })

    test('object without optional field set returns successful ValidationResult', () => {
      const validObject = {
        name: 'test',
        id: 3,
      }

      expect(validateProperties(validationModel, validObject)).toEqual({
        success: true,
        message: '',
      })
    })

    test('property with multiple types returns successful ValidationResult for all supported types', () => {
      const validObject = {
        name: 'test',
        id: '3',
      }
      const validObject2 = {
        name: 'test',
        id: 3,
      }

      expect(validateProperties(validationModel, validObject)).toEqual({
        success: true,
        message: '',
      })
      expect(validateProperties(validationModel, validObject2)).toEqual({
        success: true,
        message: '',
      })
    })

    test('missing required field returns unsuccessful ValidationResult', () => {
      const invalidObject = {
        id: 3,
      }

      expect(validateProperties(validationModel, invalidObject)).toEqual({
        success: false,
        message: `${constants.errors.prefixes.missingRequiredProperties} name\n`,
      })
    })

    test('missing multiple required fields returns unsuccessful ValidationResult with all missing listed', () => {
      expect(validateProperties(validationModel, {})).toEqual({
        success: false,
        message: `${constants.errors.prefixes.missingRequiredProperties} name, id\n`,
      })
    })

    test('extra field returns unsuccessful ValidationResult', () => {
      const invalidObject = {
        name: 'test',
        id: 3,
        extraField: 'extra',
      }

      expect(validateProperties(validationModel, invalidObject)).toEqual({
        success: false,
        message: `${constants.errors.prefixes.invalidProperties} extraField\n`,
      })
    })

    test('multiple extra fields returns unsuccessful ValidationResult with all extra listed', () => {
      const invalidObject = {
        name: 'test',
        id: 3,
        extraField: 'extra',
        extraField2: 'extra2',
      }

      expect(validateProperties(validationModel, invalidObject)).toEqual({
        success: false,
        message: `${constants.errors.prefixes.invalidProperties} extraField, extraField2\n`,
      })
    })

    test('type mismatch returns unsuccessful ValidationResult', () => {
      const invalidObject = {
        name: 4,
        id: 3,
      }

      expect(validateProperties(validationModel, invalidObject)).toEqual({
        success: false,
        message: `${constants.errors.prefixes.typeMismatches} 'name': Expected type 'string' but got type 'number'\n`,
      })
    })

    test('multiple type mismatches returns unsuccessful ValidationResult with all mismatches listed', () => {
      const invalidObject = {
        name: 4,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        id: () => {},
      }

      expect(validateProperties(validationModel, invalidObject)).toEqual({
        success: false,
        message: `${constants.errors.prefixes.typeMismatches} 'name': Expected type 'string' but got type 'number', 'id': Expected type 'string|number' but got type 'function'\n`,
      })
    })

    test('multiple errors returns unsuccessful ValidationResult', () => {
      const invalidObject = {
        name: 4,
        extraField: 'extra',
      }

      expect(validateProperties(validationModel, invalidObject)).toEqual({
        success: false,
        message: `${constants.errors.prefixes.missingRequiredProperties} id\n${constants.errors.prefixes.invalidProperties} extraField\n${constants.errors.prefixes.typeMismatches} 'name': Expected type 'string' but got type 'number'\n`,
      })
    })
  })
})

// TODO: tests for specific validators, should only test that the `validateProperties` function is called with the correct arguments
