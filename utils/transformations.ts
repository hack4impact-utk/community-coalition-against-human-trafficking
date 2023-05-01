import { AttributeFormData } from 'components/UpsertAttributeForm'
import {
  AttributeRequest,
  CheckInOutFormData,
  InventoryItemAttributeRequest,
  InventoryItemRequest,
} from 'utils/types'

/**
 * Converts a `CheckInOutFormData` object into a `Partial<InventoryItemRequest>` object
 * @param formData The form data to convert
 * @returns A new `Partial<InventoryItemRequest>` object.
 */
export function checkInOutFormDataToInventoryItemRequest(
  formData: CheckInOutFormData
): Partial<InventoryItemRequest> {
  const transformedData = {
    itemDefinition: formData.itemDefinition._id,
    attributes: [] as InventoryItemAttributeRequest[],
  }
  if (formData.attributes) {
    transformedData.attributes = [
      ...formData.attributes.map(
        (attributeOption): InventoryItemAttributeRequest => {
          return {
            attribute: attributeOption.id,
            value: attributeOption.value,
          }
        }
      ),
    ]
  }

  if (formData.textFieldAttributes) {
    transformedData.attributes = [
      ...transformedData.attributes,
      ...Object.keys(formData.textFieldAttributes).reduce(
        (acc, attributeId) => {
          const attribute: InventoryItemAttributeRequest = {
            attribute: attributeId,
            value: formData.textFieldAttributes[attributeId],
          }

          return [...acc, attribute]
        },
        [] as InventoryItemAttributeRequest[]
      ),
    ]
  }

  return transformedData
}

export function attributeFormDataToAttributeRequest(
  formData: AttributeFormData
): AttributeRequest {
  return {
    name: formData.name,
    color: formData.color,
    possibleValues:
      formData.valueType === 'list'
        ? formData.listOptions!
        : formData.valueType,
  }
}

/**
 * Converts a Date object into a readable string
 * Ex. "2022-02-10T14:47.12.419Z" becomes "February 10, 2022 9:47 AM"
 * @param date The date to convert
 * @returns A human-readable date string
 */
export function DateToReadableDateString(date: Date) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  return new Date(date).toLocaleString('en-US', dateOptions).replace(' at', '')
}
