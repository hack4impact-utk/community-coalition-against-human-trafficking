import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /* 
  This extends the Profile type defined in the next-auth library
  This is needed as emailed_verified is a part of Google OAuth's profile object
  but not in next-auth's type definition.
  See https://next-auth.js.org/getting-started/typescript for more details.
  */
  interface Profile {
    email_verified: boolean & DefaultSession["profile"]
  }
}