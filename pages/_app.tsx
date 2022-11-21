import ThemeProvider from '@mui/material/styles/ThemeProvider'
import type { AppProps } from 'next/app'
import theme from '../utils/theme'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
