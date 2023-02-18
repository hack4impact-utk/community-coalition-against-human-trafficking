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

interface Props {
  kioskMode: boolean
  users: User[]
  itemDefinitions: ItemDefinition[]
}

function CheckInOutForm({ kioskMode, users, itemDefinitions }: Props) {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()))
  const [quantity, setQuantity] = React.useState<number>(1)
  const [staffName, setStaffName] = React.useState<string | null>()
  const [itemDefinitionName, setitemDefinitionName] = React.useState<
    string | null
  >()

  let userNames: string[] = []
  users.forEach((user) => userNames.push(user.name))

  let itemDefinitionNames: string[] = []
  itemDefinitions.forEach((itemDefinition) =>
    itemDefinitionNames.push(itemDefinition.name)
  )

  return (
    <>
      <FormControl fullWidth>
        {kioskMode && (
          <Autocomplete
            options={userNames}
            renderInput={(params) => (
              <TextField {...params} label="Staff Member" />
            )}
            onChange={(_e, name) => setStaffName(name)}
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
          options={itemDefinitionNames}
          sx={{ marginTop: 4 }}
          renderInput={(params) => <TextField {...params} label="Item" />}
          onChange={(_e, name) => setitemDefinitionName(name)}
        />
        <Box sx={{ display: 'flex', alignSelf: 'center', marginTop: 3 }}>
          <Typography variant="h4" sx={{ marginRight: 2, alignSelf: 'center' }}>
            Quantity
          </Typography>
          <TextField
            sx={{
              width: 50,
              height: '100%',
              marginRight: 1.5,
              alignSelf: 'center',
            }}
            defaultValue={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            type="tel"
            InputProps={{
              inputProps: { min: 1, style: { textAlign: 'center' } },
            }}
          ></TextField>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'space-evenly',
            }}
          >
            <IconButton
              sx={{
                width: 25,
                height: 25,
                borderRadius: 1.5,
                color: 'black',
                border: '1px solid',
                borderColor: '#c4c4c4',
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
                borderColor: '#c4c4c4',
              }}
              onClick={() => setQuantity(quantity - 1)}
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
