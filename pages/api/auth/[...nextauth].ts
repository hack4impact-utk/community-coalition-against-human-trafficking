import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const client = new MongoClient(process.env.MONGODB_URI)
export const clientPromse = client.connect()

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromse),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      // Ensure that only users with the proper email domain may say in
      if (account?.provider === 'google') {
        return profile?.email_verified && profile?.email?.endsWith('@gmail.com')
      }
      return true
    },
    // modifies the session returned to have the user's id. to find this, we use the token.sub which is the subject of the token.
    async session({ session, token }) {
      if (!token.sub) return session
      session.user._id = token.sub
      return session
    },
  },
}

export default NextAuth(authOptions)
