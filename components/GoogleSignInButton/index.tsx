import * as React from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import GoogleIcon from '@mui/icons-material/Google'

export default function GoogleSignInButton() {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained" startIcon={<GoogleIcon />}>
        Login With Google
      </Button>
    </Stack>
  )
}
