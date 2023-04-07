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
  return {
    itemDefinition: formData.itemDefinition._id,
    attributes: [
      ...formData.attributes.map(
        (attributeOption): InventoryItemAttributeRequest => ({
          attribute: attributeOption.id,
          value: attributeOption.value,
        })
      ),

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
    ],
  }
}
