import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Load .env.test
dotenv.config({ path: '.env.test' })

// mock mongoDb call
// jest.mock('server/index', () => Promise.resolve())
jest.spyOn(mongoose, 'connect').mockImplementation(async () => {
  return mongoose
})

jest.mock('@next-auth/mongodb-adapter', () => ({
  MongoDBAdapter: jest.fn().mockImplementation(() => { return { client: { close: () => {}}}})
}))

jest.mock('next-auth', () => {
  return () => {}
})

jest.mock('mongodb', () => {
  const origModule = jest.requireActual('mongodb')

  return {
    __esModule: true,
    ...origModule,
    MongoClient: jest.fn().mockImplementation(() => ({ connect: () => {}}))
  }
})