import { z } from 'zod'
import mongoose from 'mongoose'

/*
  HELPER TYPES
*/
const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val))

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
  })
)

export const itemDefinitionResponseSchema = z.object({
  _id: objectId,
  name: z.string(),
  internal: z.boolean(),
  lowStockThreshold: z.number().int(),
  criticalStockThreshold: z.number().int(),
  category: categoryResponseSchema,
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
    category: categoryResponseSchema.required(),
    itemDefinition: itemDefinitionResponseSchema.required(),
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
    // assert that all defined attributes are set
    (schema) => {
      // get attr string list attributes from itemDefinition
      const itemDefinitionAttributes = schema.itemDefinition.attributes
        .filter((attr) => attr.possibleValues instanceof Array)
        .map((attr) => attr._id)

      // if no string list attributes, then we can skip this check
      if (!itemDefinitionAttributes.length) return true

      // if no attributes defined but there are itemDefinitionAttributes, we dont have them all filled out
      if (!schema.attributes) return false

      // get list of form attributes and ensure same size as itemDefinitionAttributes
      const formAttributes = schema.attributes.map((attr) => attr.id)
      return formAttributes.length === itemDefinitionAttributes.length
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
      const formAttributes = Object.keys(schema.textFieldAttributes)
      return formAttributes.length === itemDefinitionAttributes.length
    },
    {
      message: 'Must define all attributes',
      path: ['textFieldAttributes'],
    }
  )
