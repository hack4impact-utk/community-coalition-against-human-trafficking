import mongoose from 'mongoose'
import { z } from 'zod'

// export interface CheckInOutFormData {
//   user: UserResponse
//   date: Dayjs
//   category: CategoryResponse
//   itemDefinition: ItemDefinitionResponse
//   attributes: AutocompleteAttributeOption[]
//   textFieldAttributes: TextFieldAttributesInternalRepresentation
//   quantityDelta: number
// }

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val))

const hexColor = z.string().refine((val) => /^#[0-9A-F]{6}$/i.test(val))

export const checkInOutFormSchema = z
  .object({
    user: z
      .object({
        _id: objectId,
        name: z.string(),
        email: z.string().email(),
        image: z.string().url(),
      })
      .required(),
    date: z
      .date()
      .refine((val) => val <= new Date(), "Date can't be in the future"),
    category: z
      .object({
        _id: objectId,
        name: z.string(),
      })
      .required(),
    itemDefinition: z
      .object({
        _id: objectId,
        name: z.string(),
        internal: z.boolean(),
        lowStockThreshold: z.number().int(),
        criticalStockThreshold: z.number().int(),
        category: z.object({
          _id: objectId,
          name: z.string(),
        }),
        attributes: z.array(
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
        ),
      })
      .required(),
    attributes: z
      .array(
        z.object({
          id: objectId,
          label: z.string(),
          value: z.string(),
          color: hexColor,
        })
      )
      .optional(),
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
    (schema) => {
      // assert that all attributes are defined in itemDefinition
      const itemDefinitionAttributes = schema.itemDefinition.attributes
        .filter((attr) => attr.possibleValues instanceof Array)
        .map((attr) => attr._id)
      if (!itemDefinitionAttributes.length) return true
      if (!schema.attributes) return false
      const formAttributes = schema.attributes.map((attr) => attr.id)
      console.log(formAttributes)
      return formAttributes.length === itemDefinitionAttributes.length
    },
    {
      message: 'Must define all attributes',
      path: ['attributes'],
    }
  )
  .refine(
    (schema) => {
      // assert text field attributes are defined in itemDefinition
      const itemDefinitionAttributes = schema.itemDefinition.attributes
        .filter(
          (attr) =>
            attr.possibleValues === 'text' || attr.possibleValues === 'number'
        )
        .map((attr) => attr._id)
      if (!itemDefinitionAttributes.length) return true
      if (!schema.textFieldAttributes) return false
      const formAttributes = Object.keys(schema.textFieldAttributes)

      return formAttributes.length === itemDefinitionAttributes.length
    },
    {
      message: 'Must define all attributes',
      path: ['textFieldAttributes'],
    }
  )

export type CheckInOutFormData = z.infer<typeof checkInOutFormSchema>

export interface TextFieldAttributesInternalRepresentation {
  [key: string]: string | number
}
