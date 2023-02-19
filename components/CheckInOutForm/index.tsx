import { Autocomplete, Box, FormControl, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import { ItemDefinition, User } from '../../utils/types'
import QuantityForm from './quantityForm'

interface Props {
  kioskMode: boolean
  users: User[]
  itemDefinitions: ItemDefinition[]
}

function CheckInOutForm({ kioskMode, users, itemDefinitions }: Props) {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()))
  const [quantity, setQuantity] = React.useState<number>(1)
  const [selectedStaff, setSelectedStaff] = React.useState<User | null>()
  const [selectedItemDefinition, setSelectedItemDefinition] =
    React.useState<ItemDefinition | null>()

  return (
    <FormControl fullWidth>
      {/* Staff member, Date, and Item input fields */}
      {kioskMode && (
        <Autocomplete
          options={users.map((user) => user.name)}
          renderInput={(params) => (
            <TextField {...params} label="Staff Member" />
          )}
          onChange={(_e, name) =>
            setSelectedStaff(users.find((user) => name === user.name))
          }
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
        options={itemDefinitions.map((itemDefinition) => itemDefinition.name)}
        sx={{ marginTop: 4 }}
        renderInput={(params) => <TextField {...params} label="Item" />}
        onChange={(_e, name) =>
          setSelectedItemDefinition(
            itemDefinitions.find(
              (itemDefinition) => name === itemDefinition.name
            )
          )
        }
      />
      <QuantityForm quantity={quantity} setQuantity={setQuantity} />
    </FormControl>
  )
}

export default CheckInOutForm
