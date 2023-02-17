import { ObjectId } from 'mongodb'

interface Property {
  key: string
  types: string
  required: boolean
}

/**
 * Checks the validity of an Attribute object. Does not validate child objects.
 * @param attribute The Attribute object to test
 * @returns true if the object was valid, false if not
 */
export function validateAttribute(attribute: any) {
  return validateProperties(attributeModelProperties, attribute)
}

/**
 * Checks the validity of an Category object. Does not validate child objects.
 * @param category The Category object to test
 * @returns true if the object was valid, false if not
 */
export function validateCategory(category: any) {
  return validateProperties(categoryModelProperties, category)
}

/**
 * Checks the validity of an ItemDefinition object. Does not validate child objects.
 * @param itemDefinition The ItemDefinition object to test
 * @returns true if the object was valid, false if not
 */
export function validateItemDefinition(itemDefinition: any) {
  return validateProperties(itemDefinitionModelProperties, itemDefinition)
}

/**
 * Checks the validity of an InventoryItem object. Does not validate child objects.
 * @param inventoryItem The InventoryItem object to test
 * @returns true if the object was valid, false if not
 */
export function validateInventoryItem(inventoryItem: any) {
  return validateProperties(inventoryItemModelProperties, inventoryItem)
}

/**
 * Checks the validity of an User object. Does not validate child objects.
 * @param user The User object to test
 * @returns true if the object was valid, false if not
 */
export function validateUser(user: any) {
  return validateProperties(userModelProperties, user)
}

/**
 * Validates a given id to ensure it is a valid ObjectId. Throws an error if invalid.
 * @param id - The ObjectId to validate
 */
export function validateObjectId(id: string) {
  if (!id) return false
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true
  }
  return false
}

// NOTE: this ignores the _id field
function validateProperties(modelProperties: Property[], obj: any): boolean {
  if (typeof obj !== 'object') return false

  // ensures all required properties are present
  let isValidObject = true
  modelProperties.forEach((modelProp) => {
    if (
      isValidObject &&
      modelProp.required &&
      !obj.hasOwnProperty(modelProp.key)
    )
      isValidObject = false
  })

  if (!isValidObject) return false

  // checks validity of all object properties
  let objKeys = Object.keys(obj)
  objKeys.forEach((objKey) => {
    if (objKey === '_id' || !isValidObject) return
    let i = modelProperties.findIndex((prop) => prop.key === objKey)

    // property is not part of server model
    if (i < 0) {
      isValidObject = false
      return
    }

    // type mismatch
    if (modelProperties[i].types.includes(typeof obj[objKey]))
      isValidObject = false
  })

  return isValidObject
}

/*
 * Since typescript is compiled into javascript on runtime, all type information
 * is lost. This makes it exceedingly difficult to have a truly generic object
 * validator. Hence, we must define what makes a valid object down here.
 * This operates similar to how the Schema definitions do, but just in a
 * slightly different format.
 */

const attributeModelProperties: Property[] = [
  {
    key: 'name',
    types: 'string',
    required: true,
  },
  {
    key: 'possibleValues',
    types: 'string|object',
    required: true,
  },
  {
    key: 'color',
    types: 'string',
    required: true,
  },
]

const categoryModelProperties: Property[] = [
  {
    key: 'name',
    types: 'string',
    required: true,
  },
]

const itemDefinitionModelProperties: Property[] = [
  {
    key: 'name',
    types: 'string',
    required: true,
  },
  {
    key: 'category',
    types: 'string|object',
    required: false,
  },
  {
    key: 'attributes',
    types: 'object',
    required: false,
  },
  {
    key: 'internal',
    types: 'boolean',
    required: true,
  },
  {
    key: 'lowStockThreshold',
    types: 'number',
    required: true,
  },
  {
    key: 'criticalStockThreshold',
    types: 'number',
    required: true,
  },
]

const inventoryItemModelProperties: Property[] = [
  {
    key: 'itemDefinition',
    types: 'string|object',
    required: true,
  },
  {
    key: 'itemDefinition',
    types: 'object',
    required: false,
  },
  {
    key: 'quantity',
    types: 'number',
    required: true,
  },
  {
    key: 'assignee',
    types: 'string|object',
    required: true,
  },
]

const userModelProperties: Property[] = [
  {
    key: 'name',
    types: 'string',
    required: true,
  },
  {
    key: 'email',
    types: 'string',
    required: true,
  },
  {
    key: 'image',
    types: 'string',
    required: true,
  },
]
