module.exports = {
  collectCoverageFrom: ['packages/**/*.{js,jsx}', '!packages/**/*.test.{js,jsx}'],
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 91,
      functions: 98,
      lines: 98,
    },
  },
  moduleNameMapper: {
    '^@oakwood/oui-utils(.*)$': '<rootDir>/packages/oui-utils/src$1',
  },
  // testEnvironment: 'jsdom',
  // modulePathIgnorePatterns: ['/build/'],
  testPathIgnorePatterns: ['/build/'],
  setupFiles: ['<rootDir>/test/setup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
}
