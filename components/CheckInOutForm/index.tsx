import { Autocomplete, Box, FormControl, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import {
  Attribute,
  InventoryItemAttributeRequest,
  ItemDefinition,
  User,
  Category,
} from 'utils/types'
import QuantityForm from 'components/CheckInOutForm/QuantityForm'
import AttributeAutocomplete, {
  AutocompleteAttributeOption,
} from 'components/AttributeAutocomplete'
import { separateAttributes, SeparatedAttributes } from 'utils/attribute'

interface Props {
  kioskMode: boolean
  users: User[]
  itemDefinitions: ItemDefinition[]
  attributes: Attribute[]
  categories: Category[]
}

const defaultSplitAttrs = separateAttributes()

function CheckInOutForm({
  kioskMode,
  users,
  itemDefinitions,
  attributes,
  categories,
}: Props) {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()))
  const [quantity, setQuantity] = React.useState<number>(1)
  const [selectedStaff, setSelectedStaff] = React.useState<User | null>()
  const [selectedItemDefinition, setSelectedItemDefinition] =
    React.useState<ItemDefinition | null>()
  const [selectedAttributes, setSelectedAttributes] = React.useState<
    InventoryItemAttributeRequest[]
  >([])
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>()
  const [filteredItemDefinitions, setFilteredItemDefinitions] =
    React.useState<ItemDefinition[]>(itemDefinitions)
  const [splitAttrs, setSplitAttrs] =
    React.useState<SeparatedAttributes>(defaultSplitAttrs)
  const [aaSelected, setAaSelected] = React.useState<
    AttributeAutocompleteOption[]
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
