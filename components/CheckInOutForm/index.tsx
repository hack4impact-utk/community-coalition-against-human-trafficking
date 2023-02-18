import {
  Autocomplete,
  Box,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import { ItemDefinition, User } from '../../utils/types'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'
import colors from '../../utils/colors'

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
    <>
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
        {/* Quantity input field and +- buttons */}
        <Box sx={{ display: 'flex', alignSelf: 'center', marginTop: 3 }}>
          <Typography
            variant="h4"
            sx={{ marginRight: 2, alignSelf: 'center', fontSize: 28 }}
          >
            Quantity
          </Typography>
          <TextField
            sx={{
              width: 56,
              marginRight: 1.5,
            }}
            value={quantity}
            //                   || 0 Necessary to prevent typing a negative number
            onChange={(event) => setQuantity(Number(event.target.value) || 0)}
            type="tel"
            InputProps={{
              inputProps: { min: 1, style: { textAlign: 'center' } },
            }}
          ></TextField>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <IconButton
              sx={{
                width: 25,
                height: 25,
                borderRadius: 1.5,
                color: 'black',
                border: '1px solid',
                borderColor: colors.lightGray,
                marginBottom: 1,
              }}
              onClick={() => setQuantity(quantity + 1)}
            >
              <AddOutlinedIcon sx={{ width: 15, height: 15 }} />
            </IconButton>
            <IconButton
              sx={{
                width: 25,
                height: 25,
                borderRadius: 1.5,
                color: 'black',
                border: '1px solid',
                borderColor: colors.lightGray,
              }}
              onClick={() => {
                if (quantity > 1) setQuantity(quantity - 1)
              }}
            >
              <RemoveOutlinedIcon sx={{ width: 15, height: 15 }} />
            </IconButton>
          </Box>
        </Box>
      </FormControl>
    </>
  )
}

export default CheckInOutForm
