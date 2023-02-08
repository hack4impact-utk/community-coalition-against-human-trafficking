import { Box } from '@mui/system'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import NavigationDrawer from '../components/NavigationDrawer'
import HeaderAppBar from '../components/HeaderAppBar'
import React from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { useState } from 'react'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <Box sx={{ display: 'flex' }}>
          <NavigationDrawer />
          <HeaderAppBar />
          <Box sx={{ marginTop: 7 }}>
            <Component {...pageProps} />
          </Box>
        </Box>
        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
          }
        `}</style>
      </SessionProvider>
    </>
  )
}
