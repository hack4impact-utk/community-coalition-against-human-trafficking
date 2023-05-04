import React from 'react'
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input'
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import InfoIcon from '@mui/icons-material/Info'
import { useAppDispatch, useAppSelector } from 'store'
import { toggleKioskMode } from 'store/kiosk'
import { NotificationEmailResponse } from 'utils/types'
import notificationEmailsHandler from '@api/notificationEmails'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import notificationEmails from '@api/notificationEmails'
import { showSnackbar } from 'store/snackbar'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      emails: (await apiWrapper(notificationEmailsHandler, context))[0],
    },
  }
}

interface NotificationEmailProps {
  emails: NotificationEmailResponse
}

export default function SettingsPage({emails}: NotificationEmailProps) {
  const [notificationEmailData, setNotificationEmailData] = React.useState<NotificationEmailResponse>(emails)
  const [initialNotificationEmailData, setinitialNotificationEmailData] = React.useState<NotificationEmailResponse>(emails)
  const [dirty, setDirty] = React.useState(false)
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const handleChange = (newValue: MuiChipsInputChip[]) => {
    setNotificationEmailData((emailData)=>({...emailData, emails: newValue}))
  }
  React.useEffect(()=>{
    if (JSON.stringify(initialNotificationEmailData) === JSON.stringify(notificationEmailData)) {
      setDirty(false)
     } else {
      setDirty(true)
    }
  },[
    notificationEmailData,
    initialNotificationEmailData,
  ])
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const kiosk = useAppSelector((state) => state.kiosk)
  const dispatch = useAppDispatch()

  //capture initial state of emails using useeffect
  
  //in handle change test initial value and new value for deep equality 
  //if != display save button
  async function onSubmit() {
    const response = await fetch(
      `http://localhost:3000/api/notificationEmails/${notificationEmailData._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationEmailData)
      }
    )
    const data = await response.json()
    
    console.log(data)
    if(data.success) {
      console.log('here')
      setinitialNotificationEmailData(notificationEmailData)
      //@ts-ignore
      dispatch(
        showSnackbar({
          message: 'Email successfully saved.',
          severity: 'success',
        })
      )
    } else {
      //@ts-ignore
      dispatch(showSnackbar({message: data.message, severity: 'error'}))
    }

  }
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
            value={notificationEmailData.emails}
            onChange={handleChange}
            hideClearAll
          />
          {dirty && (
            <Button onClick= {()=>{onSubmit()}}>Save</Button>
          )}
        </Grid2>
        <Grid2 xs={isMobileView ? 12 : 5}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Kiosk
          </Typography>
          <Box
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            <Checkbox
              checked={kiosk.enabled}
              // @ts-ignore
              onChange={() => dispatch(toggleKioskMode())}
            />
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
