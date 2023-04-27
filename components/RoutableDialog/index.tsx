import { Dialog } from '@mui/material'
import { useRouter } from 'next/router'

interface RoutableDialogProps {
  children: React.ReactNode
}

export default function RoutableDialog({ children }: RoutableDialogProps) {
  const router = useRouter()
  const { showDialog } = router.query
  return (
    <Dialog open={!!showDialog} onClose={() => router.back()}>
      {children}
    </Dialog>
  )
}
