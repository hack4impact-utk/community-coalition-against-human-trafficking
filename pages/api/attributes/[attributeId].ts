import { NextApiRequest, NextApiResponse } from 'next'
import {
  getAttribute,
  updateAttribute,
  deleteAttribute,
} from '../../../server/actions/Attributes'
import { ApiError, Attribute } from '../../../utils/types'
import { serverAuth } from '../../../utils/auth'

// @route GET api/attributes/[attributeId] - Returns a single Attribute object given by a attributeId - Private
// @route PUT api/attributes/[attributeId] - Updates an existing Attribute object (identified by categoryId) with a new Category object - Private
// @route DELETE api/attributes/[attributeId] - Deletes a single Atttribute object (identified by attributeId) - Private
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure user is logged in
    await serverAuth(req, res)

    // ensure that attributeId is passed in
    if (!req || !req.query || !req.query.attributeId) {
      throw new ApiError(400, 'Bad Request')
    }

    const attributeId = req.query.attributeId as string
    switch (req.method) {
      case 'GET': {
        const attribute = await getAttribute(attributeId)

        return res.status(200).json({
          success: true,
          payload: attribute,
        })
      }
      case 'PUT': {
        const updatedAttribute = req.body as Attribute
        await updateAttribute(attributeId, updatedAttribute)

        return res.status(200).json({
          succcess: true,
          payload: {},
        })
      }
      case 'DELETE': {
        await deleteAttribute(attributeId)

        return res.status(200).json({
          success: true,
          payload: {},
        })
      }
      default: {
        throw new ApiError(405, 'Method Not Allowed')
      }
    }
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.statusCode).json({
        success: false,
        message: e.message,
      })
    }
  }
}
