import { Autocomplete, Box, FormControl, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect } from 'react'
import {
  ItemDefinitionResponse,
  UserResponse,
  CategoryResponse,
  InventoryItemResponse,
  CheckInOutFormData,
  TextFieldAttributesInternalRepresentation,
} from 'utils/types'
import QuantityForm from 'components/CheckInOutForm/QuantityForm'
import AttributeAutocomplete, {
  AutocompleteAttributeOption,
} from 'components/AttributeAutocomplete'
import {
  separateAttributeResponses,
  SeparatedAttributeResponses,
} from 'utils/attribute'
import { usePrevious } from 'utils/hooks/usePrevious'

interface Props {
  kioskMode: boolean
  users: UserResponse[]
  itemDefinitions: ItemDefinitionResponse[]
  categories: CategoryResponse[]
  inventoryItem?: InventoryItemResponse
  formData: CheckInOutFormData
  setFormData: (formData: CheckInOutFormData) => void
}

function blankFormData(): CheckInOutFormData {
  return {
    user: {} as UserResponse,
    date: dayjs(new Date()),
    category: {} as CategoryResponse,
    itemDefinition: {} as ItemDefinitionResponse,
    attributes: [],
    textFieldAttributes: {} as TextFieldAttributesInternalRepresentation,
    quantityDelta: 0,
  }
}

function updateFormData(
  formData: CheckInOutFormData,
  update: Partial<CheckInOutFormData>
): CheckInOutFormData {
  return {
    ...formData,
    ...update,
  }
}

const defaultSplitAttrs = separateAttributeResponses()

function CheckInOutForm({
  kioskMode,
  users,
  itemDefinitions,
  categories,
  inventoryItem,
  formData,
  setFormData,
}: Props) {
  const [filteredItemDefinitions, setFilteredItemDefinitions] =
    React.useState<ItemDefinitionResponse[]>(itemDefinitions)
  const [splitAttrs, setSplitAttrs] =
    React.useState<SeparatedAttributeResponses>(
      separateAttributeResponses(inventoryItem?.itemDefinition.attributes)
    )
  const initialFormData: Partial<CheckInOutFormData> = {
    category: inventoryItem?.itemDefinition?.category,
    itemDefinition: inventoryItem?.itemDefinition,
    attributes: inventoryItem?.attributes
      ?.filter((attr) => attr.attribute.possibleValues instanceof Array)
      .map((attr) => ({
        id: attr.attribute._id,
        label: attr.attribute.name,
        value: String(attr.value),
        color: attr.attribute.color,
      })),
    textFieldAttributes: inventoryItem?.attributes?.reduce(
      (acc, attr) =>
        !(attr.attribute.possibleValues instanceof Array)
          ? { ...acc, [attr.attribute._id]: attr.value }
          : acc,
      {} as TextFieldAttributesInternalRepresentation
    ),
  }

  const [aaSelected, setAaSelected] = React.useState<
    AutocompleteAttributeOption[]
  >(initialFormData.attributes || [])

  useEffect(() => {
    setFormData({
      ...blankFormData(),
      ...initialFormData,
    })
  }, [])

  const updateTextFieldAttributes = (
    e: string | number,
    attributeId: string
  ) => {
    const attributeValue: string | number = e

    setFormData(
      updateFormData(formData, {
        textFieldAttributes: {
          ...formData.textFieldAttributes,
          [attributeId]: attributeValue,
        },
      })
    )
  }
  const prevFormData = usePrevious(formData)

  // if you select an item definition without selecting a category, infer the category
  React.useEffect(() => {
    setFormData(
      updateFormData(formData, { category: formData.itemDefinition?.category })
    )
  }, [formData.itemDefinition])

  // Update filtered item defs when category changes
  React.useEffect(() => {
    if (formData.category && !formData.itemDefinition) {
      setFilteredItemDefinitions(
        itemDefinitions.filter((itemDefinition) => {
          if (itemDefinition.category) {
            return itemDefinition.category._id === formData.category._id
          }
        })
      )
    } else {
      setFilteredItemDefinitions(itemDefinitions)
    }
  }, [formData.category, formData.itemDefinition, itemDefinitions])

  // Update split attributes and attr form data when item definition changes
  React.useEffect(() => {
    if (formData.itemDefinition) {
      setSplitAttrs(
        separateAttributeResponses(formData.itemDefinition.attributes)
      )

      setFormData(
        updateFormData(formData, {
          attributes: [],
          textFieldAttributes: {},
        })
      )
    } else {
      setSplitAttrs(defaultSplitAttrs)
      setAaSelected([])
      setFormData(
        updateFormData(formData, {
          attributes: undefined,
          textFieldAttributes: {},
        })
      )
    }

    if (
      formData.itemDefinition !== prevFormData?.itemDefinition &&
      prevFormData?.itemDefinition
    ) {
      setAaSelected([])
      setFormData(
        updateFormData(formData, {
          attributes: undefined,
        })
      )
    }
  }, [formData.itemDefinition, prevFormData?.itemDefinition])

  return (
    <FormControl fullWidth>
      {/* Staff member, Date, and Item input fields */}
      {kioskMode && (
        <Autocomplete
          options={users}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => (
            <TextField {...params} label="Staff Member" />
          )}
          getOptionLabel={(user) => user.name}
          onChange={(_e, user) => {
            setFormData(
              updateFormData(formData, {
                user: user || undefined,
              })
            )
          }}
        />
      )}
      <Box sx={{ marginTop: 4 }}>
        <DateTimePicker
          label="Date"
          value={formData.date}
          onChange={(date) => {
            setFormData(
              updateFormData(formData, {
                date: date as Dayjs,
              })
            )
          }}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </Box>
      <Autocomplete
        options={categories}
        sx={{ marginTop: 4 }}
        renderInput={(params) => <TextField {...params} label="Category" />}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        onChange={(_e, category) => {
          setFormData(
            updateFormData(formData, {
              category: category || undefined,
            })
          )
        }}
        getOptionLabel={(category) => category.name}
        value={formData.category || null}
        disabled={!!formData.itemDefinition}
      />
      <Autocomplete
        options={filteredItemDefinitions}
        sx={{ marginTop: 4 }}
        renderInput={(params) => <TextField {...params} label="Item" />}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        onChange={(_e, itemDefinition) => {
          setFormData(
            updateFormData(formData, {
              itemDefinition: itemDefinition || undefined,
            })
          )
        }}
        getOptionLabel={(itemDefinition) => itemDefinition.name}
        value={formData.itemDefinition || null}
      />
      <AttributeAutocomplete
        attributes={splitAttrs.list}
        sx={{ mt: 4 }}
        onChange={(_e, attributes) => {
          setFormData(
            updateFormData(formData, {
              attributes: attributes || undefined,
            })
          )
        }}
        value={aaSelected}
        setValue={setAaSelected}
      />
      {/* Text Fields */}
      {splitAttrs.text.map((textAttr) => (
        <TextField
          key={textAttr._id}
          label={textAttr.name}
          onChange={(e) =>
            updateTextFieldAttributes(e.target.value, textAttr._id)
          }
          sx={{ marginTop: 4 }}
          defaultValue={formData.textFieldAttributes?.[textAttr._id]}
        />
      ))}

      {/* Number Fields */}
      {splitAttrs.number.map((numAttr) => (
        <TextField
          key={numAttr._id}
          label={numAttr.name}
          type="number"
          onChange={(e) =>
            updateTextFieldAttributes(Number(e.target.value), numAttr._id)
          }
          sx={{ marginTop: 4 }}
          defaultValue={formData.textFieldAttributes?.[numAttr._id]}
        />
      ))}

      <QuantityForm
        onChange={(quantity) => {
          setFormData(
            updateFormData(formData, {
              quantityDelta: quantity,
            })
          )
        }}
      />
    </FormControl>
  )
}

export default CheckInOutForm
