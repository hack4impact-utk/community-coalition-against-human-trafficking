import { Autocomplete, Box, FormControl, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import { Attribute, AttributeRequest, ItemDefinition, User } from 'utils/types'
import QuantityForm from 'components/CheckInOutForm/QuantityForm'
import AttributeAutocomplete from 'components/AttributeAutocomplete'
import { separateAttributes } from 'utils/attribute'

interface Props {
  kioskMode: boolean
  users: User[]
  itemDefinitions: ItemDefinition[]
  attributes?: Attribute[]
}

function CheckInOutForm({
  kioskMode,
  users,
  itemDefinitions,
  attributes,
}: Props) {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()))
  const [quantity, setQuantity] = React.useState<number>(1)
  const [selectedStaff, setSelectedStaff] = React.useState<User | null>()
  const [selectedItemDefinition, setSelectedItemDefinition] =
    React.useState<ItemDefinition | null>()
  const [selectedAttributes, setSelectedAttributes] =
    React.useState<AttributeRequest>({})
  const splitAttrs = separateAttributes(attributes)

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
