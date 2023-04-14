import { Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'store'
import { enableKioskMode, toggleKioskMode } from 'store/kiosk'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const kiosk = useAppSelector((state) => state.kiosk)

  console.log(kiosk.enabled)

  return (
    <>
      <Button onClick={() => dispatch(toggleKioskMode())}>
        Toggle Kiosk Mode
      </Button>
    </>
  )
}
