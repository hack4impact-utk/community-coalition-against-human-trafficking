import { Button } from '@mui/material'
import DialogLink from 'components/DialogLink'
import { useAppDispatch } from 'store'
import { showSnackbar } from 'store/snackbar';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  return (
    // @ts-ignore
    <Button onClick={() => dispatch(showSnackbar({ message: "hello!", severity: "success"}))}>
      Open snackbar
    </Button>
  )
}
