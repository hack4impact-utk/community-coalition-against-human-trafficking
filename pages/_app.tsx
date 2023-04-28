import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import DefaultLayout from 'components/DefaultLayout'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { wrapper } from 'store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { useRouter } from 'next/router'
import { dialogRoutes } from 'utils/constants'
import { Dialog } from '@mui/material'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { store } = wrapper.useWrappedStore(pageProps)
  const router = useRouter()
  const dialog = router.query.dialog
  const dialogRoute = dialogRoutes.find((dr) => dr.name === dialog)
  return (
    <>
      <Provider store={store}>
        {/* this type error is ok, im not sure how to fix it rn */}
        <PersistGate loading={null} persistor={store.__persistor}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SessionProvider session={session}>
              <>
                <DefaultLayout>
                  <Component {...pageProps} />
                </DefaultLayout>
                <Dialog
                  open={!!dialogRoute}
                  onClose={() => {
                    router.back()
                  }}
                >
                  {dialogRoute?.component()}
                </Dialog>
              </>
              <style jsx global>{`
                html,
                body {
                  padding: 0;
                  margin: 0;
                }
              `}</style>
            </SessionProvider>
          </LocalizationProvider>
        </PersistGate>
      </Provider>
    </>
  )
}
