import { Box } from '@mui/system'
import type { AppProps } from 'next/app'
import NavigationDrawer from '../components/NavigationDrawerListItem/NavigationDrawer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <NavigationDrawer />
      <Component {...pageProps} />
    </Box>
  )
}
