import type { AppProps } from 'next/app'
import NavigationDrawer from '../components/Drawer'
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <NavigationDrawer />
      <Component {...pageProps} />
    </div>
  )
}
