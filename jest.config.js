/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: './jest-preset.js',
  testEnvironment: 'node',
  modulePaths: ['.'],
  moduleNameMapper: {
    '@api/(.*)': '<rootDir>/pages/api/$1',
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
}
