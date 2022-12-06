export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
  }
}

export interface ApiResponse {
  success: boolean
  message?: string
  data?: unknown
}
