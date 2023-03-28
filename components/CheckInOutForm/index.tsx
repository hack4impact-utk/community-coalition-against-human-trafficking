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
} from 'utils/types'
import QuantityForm from 'components/CheckInOutForm/QuantityForm'
import AttributeAutocomplete from 'components/AttributeAutocomplete'
import { separateAttributes } from 'utils/attribute'

interface Props {
  kioskMode: boolean
  users: UserResponse[]
  itemDefinitions: ItemDefinitionResponse[]
  attributes: AttributeResponse[]
  categories: CategoryResponse[]
}

function CheckInOutForm({
  kioskMode,
  users,
  itemDefinitions,
  attributes,
  categories,
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
    React.useState<CategoryResponse | null>()
  const splitAttrs = separateAttributes(attributes)

  // if you select an item definition without selecting a category, infer the category
  React.useEffect(() => {
    // TODO: Update this when types are updated
    if (
      selectedCategory ||
      !selectedItemDefinition ||
      !selectedItemDefinition.category ||
      typeof selectedItemDefinition.category === 'string'
    ) {
      return
    }
    setSelectedCategory(selectedItemDefinition.category)
  }, [selectedItemDefinition, selectedCategory])

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
          onChange={(_e, user) => setSelectedStaff(user)}
        />
      )}
      <Box sx={{ marginTop: 4 }}>
        <DateTimePicker
          label="Date"
          value={date}
          onChange={(date) => setDate(date)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </Box>
      <Autocomplete
        options={categories}
        sx={{ marginTop: 4 }}
        renderInput={(params) => <TextField {...params} label="Category" />}
        onChange={(_e, Category) => setSelectedCategory(Category)}
        getOptionLabel={(Category) => Category.name}
        inputValue={selectedCategory ? selectedCategory.name : ''}
        disabled={!!selectedItemDefinition}
      />
      <Autocomplete
        options={itemDefinitions}
        sx={{ marginTop: 4 }}
        renderInput={(params) => <TextField {...params} label="Item" />}
        onChange={(_e, itemDefinition) =>
          setSelectedItemDefinition(itemDefinition)
        }
        getOptionLabel={(itemDefinition) => itemDefinition.name}
      />
      <AttributeAutocomplete
        attributes={splitAttrs.options}
        sx={{ mt: 4 }}
        onChange={(_e, attributes) => {
          setSelectedAttributes(attributes)
        }}
      />
      <QuantityForm quantity={quantity} setQuantity={setQuantity} />
    </FormControl>
  )
}

export default CheckInOutForm
