import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { ApiError } from './types'

export async function serverAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  userEmail?: string
) {
  const session = await unstable_getServerSession(req, res, authOptions)

  // unauthorized if no session, or of email is supplied and doesn't match the one
  // stored in the session
  if (
    !session ||
    (!!userEmail && (!session.user || session.user.email !== userEmail))
  ) {
    throw new ApiError(401, 'Unauthorized')
  }

  return session
}
