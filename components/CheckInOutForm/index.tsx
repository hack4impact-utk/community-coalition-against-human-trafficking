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
import AttributeAutocomplete from 'components/AttributeAutocomplete'
import { separateAttributes } from 'utils/attribute'

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
  attributes: AttributeResponse[]
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

function CheckInOutForm({
  kioskMode,
  users,
  itemDefinitions,
  attributes,
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
  const splitAttrs = separateAttributes(attributes)
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
        options={itemDefinitions}
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
      />
    </FormControl>
  )
}

export default CheckInOutForm
