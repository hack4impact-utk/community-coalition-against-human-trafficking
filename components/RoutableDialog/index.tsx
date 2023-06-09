import { Dialog, useMediaQuery, useTheme } from '@mui/material'
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
  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const { showDialog } = router.query

  const shouldShowDialog: boolean =
    (!name && !!showDialog) || (!!name && !!showDialog && name === showDialog)
  return (
    <Dialog
      open={shouldShowDialog}
      fullScreen={isMobileView}
      onClose={() => router.back()}
      sx={{
        '& .MuiDialog-paper': {
          minWidth: '20vw',
        },
      }}
    >
      {shouldShowDialog && children}
    </Dialog>
  )
}
