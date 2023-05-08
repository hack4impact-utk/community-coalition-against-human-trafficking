import { SxProps } from '@mui/material'
import { Autocomplete, Chip, TextField } from '@mui/material'
import React from 'react'
import { ListAttributeResponse } from 'utils/types'

export interface AutocompleteAttributeOption {
  id: string
  label: string
  value: string
  color: string
}

interface Props {
  attributes: ListAttributeResponse[]
  onChange?: (
    e: React.SyntheticEvent,
    attributes: AutocompleteAttributeOption[]
  ) => void
  value?: AutocompleteAttributeOption[]
  setValue?: React.Dispatch<AutocompleteAttributeOption[]>
  sx?: SxProps
}

function buildAutocompleteOptions(
  attributes: ListAttributeResponse[]
): AutocompleteAttributeOption[] {
  if (!attributes) {
    return [] as AutocompleteAttributeOption[]
  }

  return attributes.reduce((acc, attribute) => {
    const options = attribute.possibleValues.map((value) => ({
      id: attribute._id,
      label: attribute.name,
      value,
      color: attribute.color,
    }))

    return [...acc, ...options]
  }, [] as AutocompleteAttributeOption[])
}

export default function AttributeAutocomplete({
  attributes,
  sx,
  onChange,
  value,
  setValue,
}: Props) {
  const options = buildAutocompleteOptions(attributes)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (value?.length === attributes.length) {
      setOpen(false)
    }
  }, [value])

  return (
    <Autocomplete
      multiple
      open={open}
      options={options}
      disableCloseOnSelect
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
      value={value}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderInput={(params) => <TextField {...params} label="Attributes" />}
      onChange={(e, attributes) => {
        if (setValue) setValue(attributes)
        if (!attributes.length) {
          if (onChange) onChange(e, [] as AutocompleteAttributeOption[])
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

        if (onChange) onChange(e, attributes)
      }}
      sx={sx}
    />
  )
}
