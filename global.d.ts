/* eslint-disable no-var */

declare global {
  var mongoose: {
    conn: mongoose.ConnectOptions
    promise: mongoose.Connection
  }
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
    }
  }
}

export {}
