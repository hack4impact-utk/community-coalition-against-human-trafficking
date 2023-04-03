import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's ID in the database. */
      _id: string
      /** The user's name. */
      name: string
      /** The user's email address. */
      email: string
      /** The user's image. */
      image: string
    }
  }
}
