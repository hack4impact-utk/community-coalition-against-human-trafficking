import { Autocomplete, Box, FormControl, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import {
  ItemDefinitionResponse,
  UserResponse,
  InventoryItemAttributeRequest,
  AttributeResponse,
  CategoryResponse,
  InventoryItemResponse,
} from 'utils/types'
import QuantityForm from 'components/CheckInOutForm/QuantityForm'
import AttributeAutocomplete, {
  AutocompleteAttributeOption,
} from 'components/AttributeAutocomplete'
import { separateAttributes, SeparatedAttributes } from 'utils/attribute'

interface CheckInOutFormData {
  assignee: UserResponse
  date: Dayjs
  category: CategoryResponse
  itemDefinition: ItemDefinitionResponse
  attributes: InventoryItemAttributeRequest[]
  quantityDelta: number
}

interface Props {
  kioskMode: boolean
  users: UserResponse[]
  itemDefinitions: ItemDefinitionResponse[]
  categories: CategoryResponse[]
  inventoryItem?: InventoryItemResponse
  onChange: (data: CheckInOutFormData) => void
}

function blankFormData(): CheckInOutFormData {
  return {
    assignee: {} as UserResponse,
    date: dayjs(new Date()),
    category: {} as CategoryResponse,
    itemDefinition: {} as ItemDefinitionResponse,
    attributes: [],
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

const defaultSplitAttrs = separateAttributes()

function CheckInOutForm({
  kioskMode,
  users,
  itemDefinitions,
  categories,
  inventoryItem,
  onChange,
}: Props) {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()))
  const [quantity, setQuantity] = React.useState<number>(1)
  const [selectedStaff, setSelectedStaff] =
    React.useState<UserResponse | null>()
  const [selectedItemDefinition, setSelectedItemDefinition] =
    React.useState<ItemDefinitionResponse | null>()
  const [selectedAttributes, setSelectedAttributes] = React.useState<
    InventoryItemAttributeRequest[]
  >([])
  const [selectedCategory, setSelectedCategory] =
    React.useState<CategoryResponse>({} as CategoryResponse)
  const [filteredItemDefinitions, setFilteredItemDefinitions] =
    React.useState<ItemDefinitionResponse[]>(itemDefinitions)
  const [splitAttrs, setSplitAttrs] =
    React.useState<SeparatedAttributes>(defaultSplitAttrs)
  const [aaSelected, setAaSelected] = React.useState<
    AttributeAutocompleteOption[]
  >([])
  const initialFormData: Partial<CheckInOutFormData> = {
    assignee: inventoryItem?.assignee,
    category: inventoryItem?.itemDefinition?.category,
    itemDefinition: inventoryItem?.itemDefinition,
    // todo: attributes
  }

  const [formData, setFormData] = React.useState<CheckInOutFormData>({
    ...blankFormData(),
    ...initialFormData,
  })

  // if you select an item definition without selecting a category, infer the category
  React.useEffect(() => {
    // TODO: Update this when types are updated
    if (
      !selectedItemDefinition ||
      !selectedItemDefinition.category ||
      typeof selectedItemDefinition.category === 'string'
    ) {
      return
    }
    setSelectedCategory(selectedItemDefinition.category)
  }, [selectedItemDefinition, selectedCategory])

  React.useEffect(() => {
    onChange(formData)
  }, [onChange, formData])

  // Update filtered item defs when category changes
  React.useEffect(() => {
    if (selectedCategory) {
      setFilteredItemDefinitions(
        itemDefinitions.filter((itemDefinition) => {
          if (
            itemDefinition.category &&
            itemDefinition.category.hasOwnProperty('_id')
          ) {
            return itemDefinition.category._id === selectedCategory._id
          }
        })
      )
    } else {
      setFilteredItemDefinitions(itemDefinitions)
    }
  }, [selectedCategory, itemDefinitions])

  // Update split attributes when item definition changes
  React.useEffect(() => {
    if (selectedItemDefinition) {
      setSplitAttrs(
        separateAttributes(selectedItemDefinition.attributes as Attribute[])
      )
    } else {
      setSplitAttrs(defaultSplitAttrs)
      setSelectedAttributes([])
      setAaSelected([])
    }
  }, [selectedItemDefinition])

  React.useEffect(() => {
    console.log(selectedAttributes)
  }, [selectedAttributes])

  return (
    <FormControl fullWidth>
      {/* Staff member, Date, and Item input fields */}
      {kioskMode && (
        <Autocomplete
          options={users}
          renderInput={(params) => (
            <TextField {...params} label="Staff Member" />
          )}
          getOptionLabel={(user) => user.name}
          onChange={(_e, user) => {
            const updatedFormData = updateFormData(formData, {
              assignee: user || ({} as UserResponse),
            })
            setFormData(updatedFormData)
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
        onChange={(_e, category) => {
          const updatedFormData = updateFormData(formData, {
            category: category || ({} as CategoryResponse),
          })
          setFormData(updatedFormData)
        }}
        getOptionLabel={(category) => category.name}
        inputValue={formData.category ? formData.category.name : ''}
        disabled={!!formData.itemDefinition}
      />
      <Autocomplete
        options={filteredItemDefinitions}
        sx={{ marginTop: 4 }}
        renderInput={(params) => <TextField {...params} label="Item" />}
        onChange={(_e, itemDefinition) => {
          const updatedFormData = updateFormData(formData, {
            itemDefinition: itemDefinition || ({} as ItemDefinitionResponse),
          })
          setFormData(updatedFormData)
        }}
        getOptionLabel={(itemDefinition) => itemDefinition.name}
      />
      <AttributeAutocomplete
        attributes={splitAttrs.options}
        sx={{ mt: 4 }}
        onChange={(_e, attributes) => {
          const updatedFormData = updateFormData(formData, {
            attributes: attributes || [],
          })
          setFormData(updatedFormData)
        }}
      />
      <QuantityForm
        onChange={(quantity) => {
          setFormData(
            updateFormData(formData, {
              quantityDelta: quantity,
            })
          )
        }}
        value={aaSelected}
        setValue={setAaSelected}
      />
    </FormControl>
  )
}

export default CheckInOutForm
