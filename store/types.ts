export interface KioskState {
  enabled: boolean
}

export interface SnackbarState {
  open: boolean
  message: string
  severity?: 'success' | 'info' | 'warning' | 'error';
}