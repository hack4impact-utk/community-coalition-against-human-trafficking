import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import DefaultLayout from 'components/DefaultLayout'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SessionProvider session={session}>
          <DefaultLayout>
            <Component {...pageProps} />
          </DefaultLayout>
          <style jsx global>{`
            html,
            body {
              padding: 0;
              margin: 0;
            }
          `}</style>
        </SessionProvider>
      </LocalizationProvider>
    </>
  )
}
