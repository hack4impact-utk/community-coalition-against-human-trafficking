import type { AppProps } from 'next/app'
import HeaderAppBar from '../components/HeaderAppBar'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeaderAppBar />
      <Component {...pageProps} />
    </>
  )
}
