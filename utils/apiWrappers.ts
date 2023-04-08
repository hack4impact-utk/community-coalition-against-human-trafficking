import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import { createResponse } from 'node-mocks-http'

export async function apiWrapper(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  context: GetServerSidePropsContext
) {
  const res = createResponse()
  await handler(context.req as NextApiRequest, res)
  return res._getJSONData().payload
}
