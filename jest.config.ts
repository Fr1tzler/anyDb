import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: false,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  testMatch: ['**/*.test.ts'],
}

export default config
