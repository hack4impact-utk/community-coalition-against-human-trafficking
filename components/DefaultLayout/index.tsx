import React from 'react'
import NavigationDrawer from '../NavigationDrawer'
import HeaderAppBar from '../HeaderAppBar'
import Box from '@mui/material/Box'
interface DefaultLayoutProps {
  children: React.ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  return (
    <>
      <HeaderAppBar setDrawerOpen={setDrawerOpen} />
      <Box
        component="section"
        className="layout"
        sx={{ display: 'flex', p: 1 }}
      >
        <NavigationDrawer setDrawerOpen={setDrawerOpen} open={drawerOpen} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </>
  )
}
