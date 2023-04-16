import { createSlice } from '@reduxjs/toolkit'
import { KioskState } from 'store/types'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: KioskState = {
  enabled: false,
}

export const kioskSlice = createSlice({
  name: 'kiosk',
  initialState,
  reducers: {
    enableKioskMode: (state) => {
      state.enabled = true
    },
    disableKioskMode: (state) => {
      state.enabled = false
    },
    toggleKioskMode: (state) => {
      state.enabled = !state.enabled
    },
  },
  extraReducers(builder) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    builder.addCase(HYDRATE, (state, action: any) => ({
      ...state,
      ...action.payload.kiosk,
    }))
  },
})

export const { enableKioskMode, disableKioskMode, toggleKioskMode } =
  kioskSlice.actions

export default kioskSlice.reducer
