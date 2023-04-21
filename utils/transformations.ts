import {
  CheckInOutFormData,
  InventoryItemAttributeRequest,
  InventoryItemRequest,
} from 'utils/types'

/**
 * Converts a `CheckInOutFormData` object into a `Partial<InventoryItemRequest>` object
 * @param formData The form data to convert
 * @returns A new `Partial<InventoryItemRequest>` object.
 */
export function CheckInOutFormDataToInventoryItemRequest(
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
