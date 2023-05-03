import { Button } from '@mui/material'
import { useAppDispatch } from 'store'
import { showSnackbar } from 'store/snackbar'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  return (
    <Button
      onClick={() =>
        // @ts-ignore
        dispatch(showSnackbar({ message: 'hello!', severity: 'success' }))
      }
    >
      Open snackbar
    </Button>
  )
}
