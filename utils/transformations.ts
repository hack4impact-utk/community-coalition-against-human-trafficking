import { AttributeFormData } from 'components/AttributeForm'
import { ItemDefinitionFormData } from 'components/UpsertItemForm'
import {
  AttributeRequest,
  CheckInOutFormData,
  InventoryItemAttributeRequest,
  InventoryItemRequest,
  ItemDefinitionRequest,
} from 'utils/types'

/**
 * Converts a `CheckInOutFormData` object into a `Partial<InventoryItemRequest>` object
 * @param formData The form data to convert
 * @returns A new `Partial<InventoryItemRequest>` object.
 */
export function checkInOutFormDataToInventoryItemRequest(
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
