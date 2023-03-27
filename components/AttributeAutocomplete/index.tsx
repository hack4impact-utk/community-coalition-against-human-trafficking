import { SxProps } from '@mui/material'
import { Autocomplete, Chip, TextField } from '@mui/material'
import React from 'react'
import { AttributeResponse, OptionsAttributeResponse } from 'utils/types'

export interface AutocompleteAttributeOption {
  value: string
  attribute: AttributeResponse
}

interface Props {
  attributes: OptionsAttributeResponse[]
  onChange?: (
    e: React.SyntheticEvent,
    attributes: AutocompleteAttributeOption[]
  ) => void
  value?: AutocompleteAttributeOption[]
  setValue?: React.Dispatch<AutocompleteAttributeOption[]>
  sx?: SxProps
}

function buildAutocompleteOptions(
  attributes: OptionsAttributeResponse[]
): AutocompleteAttributeOption[] {
  if (!attributes) {
    return [] as AutocompleteAttributeOption[]
  }

  return attributes.reduce((acc, attribute) => {
    const options = attribute.possibleValues.map((value) => ({
      value,
      attribute: attribute,
    }))

    return [...acc, ...options]
  }, [] as AutocompleteAttributeOption[])
}

// function buildAttributeRequest(
//   attributes: AutocompleteAttributeOption[]
// ): InventoryItemAttributeRequest[] {
//   return attributes.map((attribute) => ({
//     attribute: attribute.id,
//     value: attribute.value,
//   }))
// }

export default function AttributeAutocomplete({
  attributes,
  sx,
  onChange,
  value,
  setValue,
}: Props) {
  console.log(attributes)
  const options = buildAutocompleteOptions(attributes)
  console.log(options)

  return (
    <Autocomplete
      multiple
      options={options}
      groupBy={(option) => option.attribute.name}
      getOptionLabel={(option) => option.value}
      isOptionEqualToValue={(option, value) =>
        option.value === value.value &&
        option.attribute.name === value.attribute.name
      }
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option.value}
            style={{ backgroundColor: option.attribute.color }}
            {...getTagProps({ index })}
            key={option.attribute._id}
          />
        ))
      }
      value={value || []}
      renderInput={(params) => <TextField {...params} label="Attributes" />}
      onChange={(e, attributes) => {
        if (!!setValue) setValue(attributes)
        if (!attributes.length) {
          if (!!onChange) onChange(e, [] as AutocompleteAttributeOption[])
        }

        // get and remove most recent attribute (the one that triggered this event)
        const newAttr = attributes.pop() as AutocompleteAttributeOption

        // check if there exists another attribute with the same label
        const idx = attributes.findIndex(
          (a) =>
            a.attribute.name == newAttr.attribute.name &&
            a.value != newAttr.value
        )

        // if so, replace that attribute with the new one. otherwise re-append it to the attributes array
        if (idx != -1) attributes[idx] = newAttr
        else attributes.push(newAttr)

        if (!!onChange) onChange(e, attributes)
      }}
      sx={sx}
    />
  )
}
