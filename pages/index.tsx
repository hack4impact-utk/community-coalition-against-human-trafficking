import { Button } from '@mui/material'
import DialogLink from 'components/DialogLink'
import { useAppDispatch, useAppSelector } from 'store'
import { toggleKioskMode } from 'store/kiosk'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  return (
    <>
      <DialogLink href={'/dialog/test'}>
        <Button>Take me to dialog</Button>
      </DialogLink>
      <Button onClick={() => dispatch(toggleKioskMode())}>
        Toggle Kiosk Mode
      </Button>
    </>
  )
}
