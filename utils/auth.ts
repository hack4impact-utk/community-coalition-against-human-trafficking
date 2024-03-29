import { NextApiRequest, NextApiResponse } from 'next'
import { Session, getServerSession } from 'next-auth'
import { authOptions } from '@api/auth/[...nextauth]'
import { ApiError } from 'utils/types'
import { errors } from 'utils/constants/errors'

/**
 * This function ensures that the person making the server call is logged in AND that the email passed in as
 * a parameter matches the email attached to their session.
 */
export async function userEndpointServerAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  userEmail?: string
) {
  const session = await getServerSession(req, res, authOptions)

  // unauthorized if no session, or of email is supplied and doesn't match the one
  // stored in the session
  if (
    !session ||
    (!!userEmail && (!session.user || session.user.email !== userEmail))
  ) {
    throw new ApiError(403, errors.unauthorized)
  }
}

export async function serverAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session> {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    throw new ApiError(401, 'Unauthenticated')
  }

  return session
}
