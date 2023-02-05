import { Box } from '@mui/system'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import NavigationDrawer from '../components/NavigationDrawer'
import HeaderAppBar from '../components/HeaderAppBar'
import { useState } from 'react'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)

  return (
    <>
      <SessionProvider session={session}>
        <Box sx={{ display: 'flex' }}>
          <NavigationDrawer
            open={navDrawerOpen}
            setDrawerOpen={setNavDrawerOpen}
          />
          <HeaderAppBar setDrawerOpen={setNavDrawerOpen} />
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
