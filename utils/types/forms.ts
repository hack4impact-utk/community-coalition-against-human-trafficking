import { AutocompleteAttributeOption } from 'components/AttributeAutocomplete'
import { Dayjs } from 'dayjs'
import mongoose from 'mongoose'
import {
  CategoryResponse,
  ItemDefinitionResponse,
  UserResponse,
} from 'utils/types'
import { z } from 'zod'

export interface CheckInOutFormData {
  user: UserResponse
  date: Dayjs
  category: CategoryResponse
  itemDefinition: ItemDefinitionResponse
  attributes: AutocompleteAttributeOption[]
  textFieldAttributes: TextFieldAttributesInternalRepresentation
  quantityDelta: number
}

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val))

const hexColor = z.string().refine((val) => /^#[0-9A-F]{6}$/i.test(val))

const checkInOutFormSchema = z.object({
  user: z
    .object({
      _id: objectId,
      name: z.string(),
      email: z.string().email(),
      image: z.string().url(),
    })
    .required(),
  date: z.instanceof(Dayjs),
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
  attributes: z.array(
    z.object({
      id: objectId,
      label: z.string(),
      value: z.string(),
      color: hexColor,
    })
  ),
  textFieldAttributes: z.record(z.string()),
  quantityDelta: z.number().int(),
})

export type CheckInOutFormSchema = z.infer<typeof checkInOutFormSchema>

export interface TextFieldAttributesInternalRepresentation {
  [key: string]: string | number
}
