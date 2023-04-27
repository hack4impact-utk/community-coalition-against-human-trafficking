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
