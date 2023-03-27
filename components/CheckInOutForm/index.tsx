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
import AttributeAutocomplete from 'components/AttributeAutocomplete'
import { separateAttributes } from 'utils/attribute'

interface Props {
  kioskMode: boolean
  users: User[]
  itemDefinitions: ItemDefinition[]
  attributes: Attribute[]
  categories: Category[]
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
  const [selectedStaff, setSelectedStaff] = React.useState<User | null>()
  const [selectedItemDefinition, setSelectedItemDefinition] =
    React.useState<ItemDefinition | null>()
  const [selectedAttributes, setSelectedAttributes] = React.useState<
    InventoryItemAttributeRequest[]
  >([])
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>()
  const splitAttrs = separateAttributes(attributes)

  let textfieldAttributes: InventoryItemAttributeRequest[] = []
  const updateTextFieldAttributes = (_e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, attributeName: string) => {
    const attributeValue: string | number = _e.target.value;
    const updatedAttribute: InventoryItemAttributeRequest = {
      attribute: attributeName,
      value: attributeValue,
    }
    textfieldAttributes.push(updatedAttribute);
    setSelectedAttributes(textfieldAttributes);
  }

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

      {/* Text Fields */}
      {splitAttrs.text.map(textAttr => (
        <TextField key={textAttr._id} label={textAttr.name} onChange={_e => updateTextFieldAttributes(_e, textAttr.name)} sx={{ marginTop: 4 }} />
      ))}

      {/* Number Fields */}
      {splitAttrs.number.map(numAttr => (
        <TextField key={numAttr._id} label={numAttr.name} type="number" onChange={_e => updateTextFieldAttributes(_e, numAttr.name)} sx={{ marginTop: 4 }} />
      ))}

      <QuantityForm quantity={quantity} setQuantity={setQuantity} />
    </FormControl>
  )
}

export default CheckInOutForm
