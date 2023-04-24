import { Button } from '@mui/material'
import DialogLink from 'components/DialogLink'
import { useAppDispatch, useAppSelector } from 'store'
import { toggleKioskMode } from 'store/kiosk';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const kiosk = useAppSelector(state => state.kiosk)

  console.log(kiosk)
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
