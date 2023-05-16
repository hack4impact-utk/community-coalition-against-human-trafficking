import { z } from 'zod'
import { validateObjectId } from 'utils/validation'

/*
  HELPER TYPES
*/
const objectId = z
  .string()
  .refine((val) => validateObjectId(val), 'Invalid ObjectId')

const hexColor = z.string().refine((val) => /^#[0-9A-F]{6}$/i.test(val))

/*
  RESPONSES
*/
export const userResponseSchema = z.object({
  _id: objectId,
  name: z.string(),
  email: z.string().email(),
  image: z.string().url(),
})

export const categoryResponseSchema = z.object({
  _id: objectId,
  name: z.string(),
})

export const attributeResponseSchema = z.array(
  z.object({
    _id: objectId,
    name: z.string(),
    possibleValues: z.union([
      z.literal('text'),
      z.literal('number'),
      z.array(z.string()),
    ]),
    color: hexColor,
    softDelete: z.boolean().optional(),
  })
)

export const itemDefinitionResponseSchema = z.object({
  _id: objectId,
  name: z.string(),
  internal: z.boolean(),
  lowStockThreshold: z.number().int(),
  criticalStockThreshold: z.number().int(),
  category: categoryResponseSchema.optional(),
  attributes: attributeResponseSchema,
})

export const inventoryItemAttributeSchema = z.array(
  z.object({
    id: objectId,
    label: z.string(),
    value: z.string(),
    color: hexColor,
  })
)

/*
  FORMS 
*/
export const checkInOutFormSchema = z
  .object({
    user: userResponseSchema.required(),
    date: z
      .date()
      .refine((val) => val <= new Date(), "Date can't be in the future"),
    category: categoryResponseSchema.optional(),
    itemDefinition: itemDefinitionResponseSchema,
    assignee: userResponseSchema.optional(),
    attributes: inventoryItemAttributeSchema.optional(),
    textFieldAttributes: z
      .record(z.string(), z.union([z.string(), z.number()]))
      .optional(),
    quantityDelta: z
      .number()
      .int()
      .refine((val) => {
        return val > 0
      }, 'Quantity must be positive'),
  })
  .refine(
    // assert that there is an assignee if the item is internal
    (schema) => {
      if (schema.itemDefinition.internal && !schema.assignee) {
        return false
      }
      return true
    },
    {
      message: 'Must assign internal items',
      path: ['assignee'],
    }
  )
  .refine(
    // assert that all defined attributes are set
    (schema) => {
      // get attr string list attributes from itemDefinition
      const itemDefinitionAttributes = schema.itemDefinition.attributes.filter(
        (attr) => attr.possibleValues instanceof Array
      )

      // if no string list attributes, then we can skip this check
      if (!itemDefinitionAttributes.length) return true

      // if no attributes defined but there are itemDefinitionAttributes, we dont have them all filled out
      if (!schema.attributes) return false

      // get list of form attributes and ensure same size as itemDefinitionAttributes
      return schema.attributes.length === itemDefinitionAttributes.length
    },
    {
      message: 'Must define all attributes',
      path: ['attributes'],
    }
  )
  .refine(
    // assert that all defined text or number attributes are set
    (schema) => {
      // get text and number attributes from itemDefinition
      const itemDefinitionAttributes = schema.itemDefinition.attributes
        .filter(
          (attr) =>
            attr.possibleValues === 'text' || attr.possibleValues === 'number'
        )
        .map((attr) => attr._id)

      // if no text or number attributes, then we can skip this check
      if (!itemDefinitionAttributes.length) return true

      // if no textFieldAttributes defined but there are itemDefinitionAttributes, we dont have them all filled out
      if (!schema.textFieldAttributes) return false

      // get keys of textFieldAttributes and ensure same size as itemDefinitionAttributes
      return (
        Object.keys(schema.textFieldAttributes).length ===
        itemDefinitionAttributes.length
      )
    },
    {
      message: 'Must define all attributes',
      path: ['textFieldAttributes'],
    }
  )

export const newItemFormSchema = itemDefinitionResponseSchema
  .extend({
    _id: objectId.optional(),
    attributes: attributeResponseSchema.optional(),
    category: categoryResponseSchema.nullable().optional(),
  })
  .refine(
    (idSchema) => idSchema.lowStockThreshold >= idSchema.criticalStockThreshold,
    {
      message:
        'Low stock threshold must be greater than critical stock threshold',
      path: ['lowStockThreshold'],
    }
  )

export const attributeFormSchema = z
  .object({
    name: z.string(),
    color: hexColor,
    valueType: z.union([
      z.literal('text'),
      z.literal('number'),
      z.literal('list'),
    ]),
    listOptions: z.array(z.string()).optional(),
  })
  .refine(
    (schema) => {
      if (schema.valueType === 'list' && !schema.listOptions?.length) {
        return false
      }
      return true
    },
    {
      message: 'Must define list options for list attributes',
      path: ['listOptions'],
    }
  )
  .refine(
    (schema) => {
      if (schema.name === '') {
        return false
      }
      return true
    },
    {
      message: 'Required',
      path: ['name'],
    }
  )

export const categoryFormSchema = z.object({
  name: z.string().refine(
    (schema: string) => {
      return schema !== ''
    },
    {
      message: 'Required',
      path: ['name'],
    }
  ),
})
