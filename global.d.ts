/* eslint-disable no-var */

declare global {
  var mongoose: {
    conn: mongoose.ConnectOptions
    promise: mongoose.Connection
  }
}

export {}
