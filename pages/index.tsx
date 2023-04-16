import { Button } from '@mui/material'
import DialogLink from 'components/DialogLink'

export default function DashboardPage() {
  return (
    <DialogLink href={'/dialog/test'}>
      <Button>Take me to dialog</Button>
    </DialogLink>
  )
}
