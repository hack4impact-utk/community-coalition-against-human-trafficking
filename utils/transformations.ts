import { ItemDefinitionFormData } from 'components/UpsertItemForm'
import { AttributeFormData } from 'components/UpsertAttributeForm'
import {
  AttributeRequest,
  CheckInOutFormData,
  CheckInOutRequest,
  InventoryItemAttributeRequest,
  ItemDefinitionRequest,
} from 'utils/types'

/**
 * Converts a `CheckInOutFormData` object into a `CheckInOutRequest` object
 * @param formData The form data to convert
 * @returns A new `CheckInOutRequest` object.
 */
export function checkInOutFormDataToCheckInOutRequest(
  formData: CheckInOutFormData
): CheckInOutRequest {
  const partialInventoryItem = {
    itemDefinition: formData.itemDefinition._id,
    attributes: [] as InventoryItemAttributeRequest[],
  }
  if (formData.attributes) {
    partialInventoryItem.attributes = [
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
    partialInventoryItem.attributes = [
      ...partialInventoryItem.attributes,
      ...Object.keys(formData.textFieldAttributes).reduce(
        (acc, attributeId) => {
          const attribute: InventoryItemAttributeRequest = {
            attribute: attributeId,
            value: formData.textFieldAttributes![attributeId],
          }

          return [...acc, attribute]
        },
        [] as InventoryItemAttributeRequest[]
      ),
    ]
  }

  const retVal: CheckInOutRequest = {
    staff: formData.user._id,
    quantityDelta: formData.quantityDelta,
    date: formData.date,
    inventoryItem: partialInventoryItem,
  }
  return retVal
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

export function itemDefinitionFormDataToItemDefinitionRequest(
  formData: ItemDefinitionFormData
): ItemDefinitionRequest {
  return {
    ...formData,
    category: formData.category._id,
    attributes: formData.attributes.map((attr) => attr._id),
  }
}

/**
 * Converts a Date object into a readable string
 * Ex. "2022-02-10T14:47.12.419Z" becomes "February 10, 2022 9:47 AM"
 * @param date The date to convert
 * @returns A human-readable date string
 */
export function dateToReadableDateString(date: Date) {
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
