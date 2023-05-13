import { Box, Typography, TextField, IconButton } from '@mui/material'
import React from 'react'
import colors from 'utils/colors'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'

interface Props {
  quantity: number
  setQuantity: (q: number) => void
  error?: string
}

function QuantityForm({ quantity, setQuantity, error }: Props) {
  return (
    <Box sx={{ display: 'flex', alignSelf: 'center', marginTop: 3 }}>
      <Typography variant="h5" sx={{ marginRight: 2, alignSelf: 'center' }}>
        Quantity
      </Typography>
      <TextField
        sx={{
          width: 56,
          marginRight: 1.5,
        }}
        value={quantity}
        //                   || 0 Necessary to prevent typing a negative number
        onChange={(event) => {
          setQuantity(Number(event.target.value) || 0)
        }}
        type="tel"
        InputProps={{
          inputProps: { min: 1, style: { textAlign: 'center' } },
        }}
        error={!!error}
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
          onClick={() => {
            setQuantity(quantity + 1)
          }}
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
            if (quantity > 1) {
              setQuantity(quantity - 1)
            }
          }}
        >
          <RemoveOutlinedIcon sx={{ width: 15, height: 15 }} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default QuantityForm
