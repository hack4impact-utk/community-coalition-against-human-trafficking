import { z } from 'zod'
import {
  attributeFormSchema,
  categoryFormSchema,
  checkInOutFormSchema,
  newItemFormSchema,
} from 'utils/types'

export type CheckInOutFormData = z.infer<typeof checkInOutFormSchema>
export type ItemDefinitionFormData = z.infer<typeof newItemFormSchema>
export type AttributeFormData = z.infer<typeof attributeFormSchema>
export type CategoryFormData = z.infer<typeof categoryFormSchema>

export interface TextFieldAttributesInternalRepresentation {
  [key: string]: string | number
}
