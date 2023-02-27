import {
  Attribute,
  NumberAttribute,
  OptionsAttribute,
  TextAttribute,
} from 'utils/types/models'

export function getOptionAttributes(
  attributes: Attribute[]
): OptionsAttribute[] {
  return attributes.filter(
    (attribute) => attribute.possibleValues instanceof Array
  ) as OptionsAttribute[]
}

export interface SeparatedAttributes {
  options: OptionsAttribute[]
  text: TextAttribute[]
  number: NumberAttribute[]
}

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
