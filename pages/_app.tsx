import type { AppProps } from 'next/app'
import HeaderAppBar from '../components/HeaderAppBar'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeaderAppBar />
      <Component {...pageProps} />
      <GoogleSignInButton />
    </>
  )
}
