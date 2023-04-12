import { Button } from '@mui/material'
import DialogLink from 'components/DialogLink'
import { useAppDispatch, useAppSelector } from 'store'
import { enableKioskMode, toggleKioskMode } from 'store/kiosk'

export default function DashboardPage() {
  return (
    <DialogLink href={'/dialog/test'}>
      <Button>Take me to dialog</Button>
    </DialogLink>
  )
}
