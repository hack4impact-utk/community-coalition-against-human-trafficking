import * as validation from 'utils/validation'
import * as validators from 'utils/validators'

describe('validators', () => {
  const mockValidator = jest
    .spyOn(validation, 'validateProperties')
    .mockImplementation()
  const testObj = {}

  describe('validateAttributeRequest', () => {
    test('PUT should use attributePutModelProperties', () => {
      validators.validateAttributeRequest(testObj, 'PUT')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.attributePutModelProperties,
        testObj
      )
    })
    test('POST should use attributePutModelProperties', () => {
      validators.validateAttributeRequest(testObj, 'POST')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.attributePostModelProperties,
        testObj
      )
    })
    test('no requestType should use testObjModelProperties', () => {
      validators.validateAttributeRequest(testObj)
      expect(mockValidator).toHaveBeenCalledWith(
        validators.attributeRequestModelProperties,
        testObj
      )
    })
  })

  describe('validateCategoryRequest', () => {
    test('PUT should use categoryPutModelProperties', () => {
      validators.validateCategoryRequest(testObj, 'PUT')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.categoryPutModelProperties,
        testObj
      )
    })
    test('POST should use categoryPutModelProperties', () => {
      validators.validateCategoryRequest(testObj, 'POST')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.categoryPostModelProperties,
        testObj
      )
    })
    test('no requestType should use categoryRequestModelProperties', () => {
      validators.validateCategoryRequest(testObj)
      expect(mockValidator).toHaveBeenCalledWith(
        validators.categoryRequestModelProperties,
        testObj
      )
    })
  })

  describe('validateItemDefinitionRequest', () => {
    test('PUT should use itemDefinitionPutModelProperties', () => {
      validators.validateItemDefinitionRequest(testObj, 'PUT')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.itemDefinitionPutModelProperties,
        testObj
      )
    })
    test('POST should use itemDefinitionPutModelProperties', () => {
      validators.validateItemDefinitionRequest(testObj, 'POST')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.itemDefinitionPostModelProperties,
        testObj
      )
    })
    test('no requestType should use itemDefinitionRequestModelProperties', () => {
      validators.validateItemDefinitionRequest(testObj)
      expect(mockValidator).toHaveBeenCalledWith(
        validators.itemDefinitionRequestModelProperties,
        testObj
      )
    })
  })

  describe('validateInventoryItemRequest', () => {
    test('PUT should use inventoryItemPutModelProperties', () => {
      validators.validateInventoryItemRequest(testObj, 'PUT')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.inventoryItemPutModelProperties,
        testObj
      )
    })
    test('POST should use inventoryItemPutModelProperties', () => {
      validators.validateInventoryItemRequest(testObj, 'POST')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.inventoryItemPostModelProperties,
        testObj
      )
    })
    test('no requestType should use inventoryItemRequestModelProperties', () => {
      validators.validateInventoryItemRequest(testObj)
      expect(mockValidator).toHaveBeenCalledWith(
        validators.inventoryItemRequestModelProperties,
        testObj
      )
    })
  })

  describe('validateUserRequest', () => {
    test('PUT should use userPutModelProperties', () => {
      validators.validateUserRequest(testObj, 'PUT')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.userPutModelProperties,
        testObj
      )
    })
    test('POST should use userPutModelProperties', () => {
      validators.validateUserRequest(testObj, 'POST')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.userPostModelProperties,
        testObj
      )
    })
    test('no requestType should use userRequestModelProperties', () => {
      validators.validateUserRequest(testObj)
      expect(mockValidator).toHaveBeenCalledWith(
        validators.userRequestModelProperties,
        testObj
      )
    })
  })

  describe('validateLogRequest', () => {
    test('PUT should use logPutModelProperties', () => {
      validators.validateLogRequest(testObj, 'PUT')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.logPutModelProperties,
        testObj
      )
    })
    test('POST should use logPutModelProperties', () => {
      validators.validateLogRequest(testObj, 'POST')
      expect(mockValidator).toHaveBeenCalledWith(
        validators.logPostModelProperties,
        testObj
      )
    })
    test('no requestType should use logRequestModelProperties', () => {
      validators.validateLogRequest(testObj)
      expect(mockValidator).toHaveBeenCalledWith(
        validators.logRequestModelProperties,
        testObj
      )
    })
  })
})
