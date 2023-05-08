import { z } from 'zod'
import { checkInOutFormSchema } from 'utils/types'

export type CheckInOutFormData = z.infer<typeof checkInOutFormSchema>

export interface TextFieldAttributesInternalRepresentation {
  [key: string]: string | number
}
