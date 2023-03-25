import {
  Attribute,
  InventoryItemAttribute,
  NumberAttribute,
  OptionsAttribute,
  TextAttribute,
} from 'utils/types/models'
export interface SeparatedAttributes {
  options: OptionsAttribute[]
  text: TextAttribute[]
  number: NumberAttribute[]
}

/**
 * Separates an array of Attributes based on the values they can hold.
 * @param attributes The array of Attributes to separate.
 * @returns A `SeparatedAttributes` object containing the different kinds of attributes.
 */
export function separateAttributes(
  attributes?: Attribute[]
): SeparatedAttributes {
  const defaultSplit: SeparatedAttributes = {
    options: [],
    text: [],
    number: [],
  }

  if (!attributes) return defaultSplit

  return attributes.reduce((acc, attribute) => {
    if (attribute.possibleValues instanceof Array) {
      acc.options = [...acc.options, attribute as OptionsAttribute]
    } else if (attribute.possibleValues === 'text') {
      acc.text = [...acc.text, attribute as TextAttribute]
    } else if (attribute.possibleValues === 'number') {
      acc.number = [...acc.number, attribute as NumberAttribute]
    }

    return acc
  }, defaultSplit)
}
