import { z } from 'zod'
import {
  attributeFormSchema,
  checkInOutFormSchema,
  itemDefinitionFormSchema,
} from 'utils/types'

export type CheckInOutFormData = z.infer<typeof checkInOutFormSchema>
export type ItemDefinitionFormData = z.infer<typeof itemDefinitionFormSchema>
export type AttributeFormData = z.infer<typeof attributeFormSchema>

export interface TextFieldAttributesInternalRepresentation {
  [key: string]: string | number
}
