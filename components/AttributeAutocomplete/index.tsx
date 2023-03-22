import { SxProps } from '@mui/material'
import { Autocomplete, Chip, TextField } from '@mui/material'
import React from 'react'
import { InventoryItemAttributeRequest, OptionsAttribute } from 'utils/types'

interface AutocompleteAttributeOption {
  id: string
  label: string
  value: string
  color: string
}

interface Props {
  attributes: OptionsAttribute[]
  onChange?: (
    e: React.SyntheticEvent,
    attributes: InventoryItemAttributeRequest[]
  ) => void
  sx?: SxProps
}

function buildAutocompleteOptions(
  attributes: OptionsAttribute[]
): AutocompleteAttributeOption[] {
  return attributes.reduce((acc, attribute) => {
    const options = attribute.possibleValues.map((value) => ({
      id: attribute._id!, // todo: remove when request and reponse objects are separated
      label: attribute.name,
      value,
      color: attribute.color,
    }))

    return [...acc, ...options]
  }, [] as AutocompleteAttributeOption[])
}

function buildAttributeRequest(
  attributes: AutocompleteAttributeOption[]
): InventoryItemAttributeRequest[] {
  return attributes.map((attribute) => ({
    attribute: attribute.id,
    value: attribute.value,
  }))
}

export default function AttributeAutocomplete({
  attributes,
  sx,
  onChange,
}: Props) {
  const options = buildAutocompleteOptions(attributes)

  return (
    <Autocomplete
      multiple
      options={options}
      groupBy={(option) => option.label}
      getOptionLabel={(option) => option.value}
      isOptionEqualToValue={(option, value) =>
        option.value === value.value && option.label === value.label
      }
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option.value}
            style={{ backgroundColor: option.color }}
            {...getTagProps({ index })}
            key={option.id}
          />
        ))
      }
      renderInput={(params) => <TextField {...params} label="Attributes" />}
      onChange={(e, attributes) => {
        if (!attributes.length) {
          if (!!onChange) onChange(e, [] as InventoryItemAttributeRequest[])
          return
        }

        // get and remove most recent attribute (the one that triggered this event)
        const newAttr = attributes.pop() as AutocompleteAttributeOption

        // check if there exists another attribute with the same label
        const idx = attributes.findIndex(
          (a) => a.label == newAttr.label && a.value != newAttr.value
        )

        // if so, replace that attribute with the new one. otherwise re-append it to the attributes array
        if (idx != -1) attributes[idx] = newAttr
        else attributes.push(newAttr)

        if (!!onChange) onChange(e, buildAttributeRequest(attributes))
      }}
      sx={sx}
    />
  )
}
