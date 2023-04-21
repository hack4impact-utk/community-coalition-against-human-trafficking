import React from 'react'
import NavigationDrawer from 'components/NavigationDrawer'
import HeaderAppBar from 'components/HeaderAppBar'
import Box from '@mui/material/Box'
import { useAppDispatch, useAppSelector } from 'store'
import { clearSnackbar } from 'store/snackbar'
import { Alert, Snackbar } from '@mui/material'
interface DefaultLayoutProps {
  children: React.ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const dispatch = useAppDispatch();
  const snackbar = useAppSelector((state) => state.snackbar)

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(clearSnackbar());
  };
  return (
    <>
      <HeaderAppBar setDrawerOpen={setDrawerOpen} />
      <Box
        component="section"
        className="layout"
        sx={{ display: 'flex', py: 1, px: 0 }}
      >
        <NavigationDrawer setDrawerOpen={setDrawerOpen} open={drawerOpen} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={10000} onClose={handleClose} anchorOrigin={{vertical: "bottom", horizontal: "right"}} >
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
