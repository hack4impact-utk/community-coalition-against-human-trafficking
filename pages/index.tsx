import { Button } from '@mui/material'
import { useAppDispatch } from 'store'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  return (
    <>
      <DialogLink href={'/dialog/test'}>
        <Button>Take me to dialog</Button>
      </DialogLink>
      {/* @ts-ignore */}
      <Button onClick={() => dispatch(toggleKioskMode())}>
        Toggle Kiosk Mode
      </Button>
    </>
  )
}
