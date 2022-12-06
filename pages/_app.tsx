import { Box } from '@mui/system'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import NavigationDrawer from '../components/NavigationDrawer'
import HeaderAppBar from '../components/HeaderAppBar'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <Box sx={{ display: 'flex' }}>
          <HeaderAppBar />
          <NavigationDrawer />
          <Component {...pageProps} />
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
