import { useSession, signIn, signOut } from 'next-auth/react'

export default function test() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <p>Logged in as {session.user?.email}</p>
        <p>Your name is {session.user?.name}</p>
        <p>Your image URL is {session.user?.image}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  } else {
    return (
      <>
        <p>You are not logged in</p>
        <button onClick={() => signIn("google")}>Sign in</button>
      </>
    )
  }
}
