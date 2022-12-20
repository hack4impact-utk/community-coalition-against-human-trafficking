import React from 'react'
import NavigationDrawer from '../NavigationDrawer'
import HeaderAppBar from '../HeaderAppBar'
interface DefaultLayoutProps {
  children: React.ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  return (
    <section className="layout">
      <HeaderAppBar setDrawerOpen={setDrawerOpen} />
      <NavigationDrawer setDrawerOpen={setDrawerOpen} open={drawerOpen} />
      <main>{children}</main>
    </section>
  )
}
