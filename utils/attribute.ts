import {
  Attribute,
  NumberAttribute,
  OptionsAttribute,
  TextAttribute,
} from 'utils/types/models'
import {
  AttributeResponse,
  NumberAttributeResponse,
  OptionsAttributeResponse,
  TextAttributeResponse,
} from './types'
export interface SeparatedAttributes {
  options: OptionsAttribute[]
  text: TextAttribute[]
  number: NumberAttribute[]
}

export interface SeparatedAttributeResponses {
  options: OptionsAttributeResponse[]
  text: TextAttributeResponse[]
  number: NumberAttributeResponse[]
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

/**
 * Separates an array of Attributes based on the values they can hold. TODO: find way to make more generic
 * @param attributes The array of Attributes to separate.
 * @returns A `SeparatedAttributes` object containing the different kinds of attributes.
 */
export function separateAttributeResponses(
  attributes?: AttributeResponse[]
): SeparatedAttributeResponses {
  const defaultSplit: SeparatedAttributeResponses = {
    options: [],
    text: [],
    number: [],
  }

  if (!attributes) return defaultSplit

  return attributes.reduce((acc, attribute) => {
    if (attribute.possibleValues instanceof Array) {
      acc.options = [...acc.options, attribute as OptionsAttributeResponse]
    } else if (attribute.possibleValues === 'text') {
      acc.text = [...acc.text, attribute as TextAttributeResponse]
    } else if (attribute.possibleValues === 'number') {
      acc.number = [...acc.number, attribute as NumberAttributeResponse]
    }

    return acc
  }, defaultSplit)
}
