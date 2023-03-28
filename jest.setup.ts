import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Load .env.test
dotenv.config({ path: '.env.test' })

// mock mongoDb call
// jest.mock('server/index', () => Promise.resolve())
jest.spyOn(mongoose, 'connect').mockImplementation(async () => {
  return mongoose
})
