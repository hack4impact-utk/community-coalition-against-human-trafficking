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
import AttributeAutocomplete, {
  AutocompleteAttributeOption,
} from 'components/AttributeAutocomplete'
import { separateAttributes, SeparatedAttributes } from 'utils/attribute'

interface Props {
  kioskMode: boolean
  users: UserResponse[]
  itemDefinitions: ItemDefinitionResponse[]
  attributes: AttributeResponse[]
  categories: CategoryResponse[]
}

const defaultSplitAttrs = separateAttributes()

function CheckInOutForm({
  kioskMode,
  users,
  itemDefinitions,
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
  const [filteredItemDefinitions, setFilteredItemDefinitions] =
    React.useState<ItemDefinitionResponse[]>(itemDefinitions)
  const [splitAttrs, setSplitAttrs] =
    React.useState<SeparatedAttributes>(defaultSplitAttrs)
  const [aaSelected, setAaSelected] = React.useState<
    AutocompleteAttributeOption[]
  >([])

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
        separateAttributes(
          selectedItemDefinition.attributes as AttributeResponse[]
        )
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
        options={filteredItemDefinitions}
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
        value={aaSelected}
        setValue={setAaSelected}
      />
      <QuantityForm quantity={quantity} setQuantity={setQuantity} />
    </FormControl>
  )
}

export default CheckInOutForm
