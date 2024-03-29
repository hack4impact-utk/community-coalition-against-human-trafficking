import { AppConfigResponse } from 'utils/types'

export type ConfigState = Partial<Omit<AppConfigResponse, '_id'>>

export interface KioskState {
  enabled: boolean
}

export interface SnackbarState {
  open: boolean
  message: string
  severity?: 'success' | 'info' | 'warning' | 'error'
}
