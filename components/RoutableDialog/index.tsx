import { Dialog } from '@mui/material'
import { useRouter } from 'next/router'

interface RoutableDialogProps {
  name?: string
  children: React.ReactNode
}

export default function RoutableDialog({
  name,
  children,
}: RoutableDialogProps) {
  const router = useRouter()
  const { showDialog } = router.query

  const shouldShowDialog: boolean =
    (!name && !!showDialog) || (!!name && !!showDialog && name === showDialog)
  return (
    <Dialog open={shouldShowDialog} onClose={() => router.back()}>
      {children}
    </Dialog>
  )
}
