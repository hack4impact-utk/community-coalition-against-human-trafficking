import { Box } from '@mui/system'
import type { AppProps } from 'next/app'
import NavigationDrawer from '../components/NavigationDrawer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
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
    </>
  )
}
