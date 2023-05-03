import React from 'react'
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input'
import {
  Box,
  Checkbox,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import InfoIcon from '@mui/icons-material/Info'

export default function SettingsPage() {
  const theme = useTheme()
  const [value, setValue] = React.useState<MuiChipsInputChip[]>([])
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const handleChange = (newValue: MuiChipsInputChip[]) => {
    setValue(newValue)
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return (
    <>
      <Grid2
        container
        my={2}
        mx={2}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Grid2 xs={isMobileView ? 12 : 5}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Notifications
          </Typography>
        </Grid2>
        <Grid2 xs={isMobileView ? 12 : 5}>
          <Typography sx={{ mb: 2 }}>
            Send email notifications for items with critically low stock to:
          </Typography>
        </Grid2>
        <Grid2 xs={isMobileView ? 12 : 5} sx={{ mb: 4 }}>
          <MuiChipsInput
            sx={{ width: '100%' }}
            validate={(value) => {
              return {
                isError: !value.match(emailRegex)?.length,
                textError: 'Enter a valid email address',
              }
            }}
            value={value}
            onChange={handleChange}
            hideClearAll
          />
        </Grid2>
        <Grid2 xs={isMobileView ? 12 : 5}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Kiosk
          </Typography>
          <Box
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            <Checkbox />
            <Typography mr={1}>Enable Kiosk Mode</Typography>
            <Tooltip
              title="Kiosk Mode enables a field to specify which staff member is checking an item in or out."
              placement="top"
              enterTouchDelay={0}
            >
              <InfoIcon sx={{ color: theme.palette.grey['500'] }} />
            </Tooltip>
          </Box>
        </Grid2>
      </Grid2>
    </>
  )
}
