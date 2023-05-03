import { z } from 'zod'
import { checkInOutFormSchema } from 'utils/types'

// export interface CheckInOutFormData {
//   user: UserResponse
//   date: Dayjs
//   category: CategoryResponse
//   itemDefinition: ItemDefinitionResponse
//   attributes: AutocompleteAttributeOption[]
//   textFieldAttributes: TextFieldAttributesInternalRepresentation
//   quantityDelta: number
// }

export type CheckInOutFormData = z.infer<typeof checkInOutFormSchema>

export interface TextFieldAttributesInternalRepresentation {
  [key: string]: string | number
}
