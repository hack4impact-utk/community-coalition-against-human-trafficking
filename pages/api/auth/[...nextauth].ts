import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      // Ensure that only users with the proper email domain may say in
      if (account?.provider === 'google') {
        return profile?.email_verified && profile?.email?.endsWith('@gmail.com')
      }
      return true
    },
  },
})
