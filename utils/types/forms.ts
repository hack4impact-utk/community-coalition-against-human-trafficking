import { AutocompleteAttributeOption } from 'components/AttributeAutocomplete'
import { Dayjs } from 'dayjs'
import {
  CategoryResponse,
  ItemDefinitionResponse,
  UserResponse,
} from 'utils/types'

export interface CheckInOutFormData {
  user: UserResponse
  date: Dayjs
  category: CategoryResponse
  itemDefinition: ItemDefinitionResponse
  attributes: AutocompleteAttributeOption[]
  textFieldAttributes: TextFieldAttributesInternalRepresentation
  quantityDelta: number
}

export interface TextFieldAttributesInternalRepresentation {
  [key: string]: string | number
}
