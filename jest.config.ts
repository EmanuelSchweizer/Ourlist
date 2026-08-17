import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Handle module aliases (must mirror the "paths" entries in tsconfig.json)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/store/(.*)$': '<rootDir>/src/store/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1',
    '^@heroui/react$': '<rootDir>/node_modules/@heroui/react/dist/index.js',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default async () => {
  const nextJestConfig = await createJestConfig(config)()
  // next/jest only appends to its own transformIgnorePatterns, it never lets us
  // replace them, so its default pattern still blocks ESM packages like @heroui
  // even after we add an "allow" entry. Overriding the merged array here is the
  // only way to actually let @heroui/@react-aria/etc. get transformed.
  nextJestConfig.transformIgnorePatterns = [
    '/node_modules/(?!(@heroui|@react-aria|@react-stately|@react-types|@internationalized)/)',
  ]
  return nextJestConfig
}