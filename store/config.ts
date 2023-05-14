import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConfigState } from 'store/types'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: ConfigState = {
  emails: [],
  defaultAttributes: [],
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateConfig: (state, action: PayloadAction<ConfigState>) => {
      state.emails = action.payload.emails
      state.defaultAttributes = action.payload.defaultAttributes
    },
  },
  extraReducers(builder) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    builder.addCase(HYDRATE, (state, action: any) => ({
      ...state,
      ...action.payload.config,
    }))
  },
})

export const { updateConfig } = configSlice.actions

export default configSlice.reducer
