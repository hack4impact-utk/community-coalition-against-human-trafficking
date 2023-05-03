import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnackbarState } from './types';

const initialState: SnackbarState = {
  open: false,
  message: ''
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<Omit<SnackbarState, "open">>) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    clearSnackbar: (state) => {
      state.open = false;
    }
  }
});

export const { showSnackbar, clearSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;