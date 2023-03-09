import dotenv from 'dotenv'

// Load .env.test
dotenv.config({ path: '.env.local' })

// mock mongoDb call
// jest.mock('server/index', () => Promise.resolve())
