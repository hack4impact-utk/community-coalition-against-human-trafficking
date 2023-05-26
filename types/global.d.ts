/* eslint-disable no-var */

declare global {
  var mongoose: {
    conn: mongoose
    promise: Promise<mongoose> | null
  }
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      ALLOWED_EMAILS: string
    }
  }
}

export {}
