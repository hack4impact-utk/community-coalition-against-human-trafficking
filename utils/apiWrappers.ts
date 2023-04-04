import { GetServerSidePropsContext, NextApiRequest } from 'next'
import { createResponse } from 'node-mocks-http'
import {
  CategoryResponse,
  InventoryItemResponse,
  ItemDefinitionResponse,
  UserResponse,
} from './types'
import categoriesHandler from '@api/categories'
import itemDefinitionsHandler from '@api/itemDefinitions'
import usersHandler from '@api/users'
import inventoryItemsHandler from '@api/inventoryItems'

export async function getCategoriesApi(
  context: GetServerSidePropsContext
): Promise<CategoryResponse[]> {
  const res = createResponse()
  await categoriesHandler(context.req as NextApiRequest, res)
  return res._getJSONData().payload
}

export async function getItemDefinitionsApi(
  context: GetServerSidePropsContext
): Promise<ItemDefinitionResponse[]> {
  const res = createResponse()
  await itemDefinitionsHandler(context.req as NextApiRequest, res)
  return res._getJSONData().payload
}

export async function getInventoryItemsApi(
  context: GetServerSidePropsContext
): Promise<InventoryItemResponse[]> {
  const res = createResponse()
  await inventoryItemsHandler(context.req as NextApiRequest, res)
  return res._getJSONData().payload
}

export async function getUsersApi(
  context: GetServerSidePropsContext
): Promise<UserResponse[]> {
  const res = createResponse()
  await usersHandler(context.req as NextApiRequest, res)
  return res._getJSONData().payload
}
