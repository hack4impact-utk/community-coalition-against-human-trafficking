import { configureStore, combineReducers } from '@reduxjs/toolkit'
import kioskReducer, { kioskSlice } from 'store/kiosk'
import { KioskState } from 'store/types'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { createWrapper } from 'next-redux-wrapper'
import storage from 'redux-persist/lib/storage'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

export type RootState = {
  kiosk: KioskState
}

function preloadState(): RootState {
  return {
    kiosk: {
      enabled: false,
    },
  }
}

const rootReducer = combineReducers({
  [kioskSlice.name]: kioskSlice.reducer,
})

const makeConfiguredStore = () =>
  configureStore({
    reducer: {
      kiosk: kioskReducer,
    },
    preloadedState: preloadState(),
    devTools: process.env.NODE_ENV !== 'production',
  })

const makeStore = () => {
  const isServer = typeof window === 'undefined'
  if (isServer) {
    return makeConfiguredStore()
  } else {
    const persistConfig = {
      key: 'root',
      whitelist: ['kiosk'],
      storage,
    }

    const persistedReducer = persistReducer(persistConfig, rootReducer)
    const store: ReturnType<typeof configureStore> & {
      __persistor: ReturnType<typeof persistStore>
    } = configureStore({
      reducer: persistedReducer,
      preloadedState: preloadState(),
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
      devTools: process.env.NODE_ENV !== 'production',
    })
    store.__persistor = persistStore(store)
    return store
  }
}

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const wrapper = createWrapper<AppStore>(makeStore)
