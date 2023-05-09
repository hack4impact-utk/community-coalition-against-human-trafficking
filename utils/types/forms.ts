import { z } from 'zod'
import { checkInOutFormSchema, newItemFormSchema } from 'utils/types'

export type CheckInOutFormData = z.infer<typeof checkInOutFormSchema>
export type NewItemFormData = z.infer<typeof newItemFormSchema>

export interface TextFieldAttributesInternalRepresentation {
  [key: string]: string | number
}
