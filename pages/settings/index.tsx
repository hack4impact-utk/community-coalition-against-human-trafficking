import React from 'react'
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
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
import { AppConfigResponse, AttributeResponse } from 'utils/types'
import appConfigsHandler from '@api/appConfigs'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import { showSnackbar } from 'store/snackbar'
import { LoadingButton } from '@mui/lab'
import urls from 'utils/urls'
import getContrastYIQ from 'utils/getContrastYIQ'
import attributesHandler from '@api/attributes'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      config: (await apiWrapper(appConfigsHandler, context))[0],
      attributes: await apiWrapper(attributesHandler, context),
    },
  }
}

interface GeneralSettingsProps {
  config: AppConfigResponse
  attributes: AttributeResponse[]
}

export default function SettingsPage({
  config,
  attributes,
}: GeneralSettingsProps) {
  const [appConfigData, setAppConfigData] =
    React.useState<AppConfigResponse>(config)
  const [initialAppConfigData, setInitialAppConfigData] =
    React.useState<AppConfigResponse>(config)
  const [dirty, setDirty] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const handleChange = (newValue: MuiChipsInputChip[]) => {
    setAppConfigData((emailData) => ({
      ...emailData,
      emails: newValue,
    }))
  }

  React.useEffect(() => {
    setDirty(
      JSON.stringify(initialAppConfigData) !== JSON.stringify(appConfigData)
    )
  }, [appConfigData, initialAppConfigData])

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const kiosk = useAppSelector((state) => state.kiosk)
  const dispatch = useAppDispatch()
  async function onSubmit() {
    setLoading(true)

    const response = await fetch(
      urls.api.appConfigs.appConfig(appConfigData._id),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appConfigData),
      }
    )
    const data = await response.json()
    setLoading(false)

    if (data.success) {
      setInitialAppConfigData(appConfigData)
      //@ts-ignore
      dispatch(
        showSnackbar({
          message: 'Emails successfully saved.',
          severity: 'success',
        })
      )
    } else {
      //@ts-ignore
      dispatch(showSnackbar({ message: data.message, severity: 'error' }))
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
        <Grid2 xs={isMobileView ? 12 : 5} sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Kiosk
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Enables a field to specify which staff member is checking an item in
            or out.
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
          </Box>
        </Grid2>
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
            value={appConfigData.emails}
            onChange={handleChange}
            hideClearAll
          />
        </Grid2>
        <Grid2 xs={isMobileView ? 12 : 5}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Default attributes
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Apply these attributes to new items by default:
          </Typography>
          <Box
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            <Autocomplete
              autoHighlight
              fullWidth
              multiple
              value={appConfigData.defaultAttributes}
              renderInput={(params) => (
                <TextField {...params} label="Attributes" />
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              getOptionLabel={(option) => option.name}
              options={attributes}
              onChange={(_e, newValue) => {
                setAppConfigData((emailData) => ({
                  ...emailData,
                  defaultAttributes: newValue,
                }))
              }}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    label={option.name}
                    sx={{
                      backgroundColor: option.color,
                      '& .MuiChip-label': {
                        color: getContrastYIQ(option.color),
                      },
                    }}
                    {...getTagProps({ index })}
                    key={index}
                  />
                ))
              }
            />
          </Box>
        </Grid2>

        <Grid2 xs={isMobileView ? 12 : 5} sx={{ mt: 4 }}>
          {dirty && (
            <Grid2 display="flex" justifyContent="flex-end" mt={1}>
              <Button
                sx={{ mr: 2 }}
                onClick={() => {
                  setAppConfigData(initialAppConfigData)
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                onClick={() => {
                  onSubmit()
                }}
                loading={loading}
              >
                Save
              </LoadingButton>
            </Grid2>
          )}
        </Grid2>
      </Grid2>
    </>
  )
}
