module.exports = {
  collectCoverageFrom: [
    'packages/**/*.{js,jsx}',
    '!packages/**/*.test.{js,jsx}',
    '!packages/**/index.{js,jsx}',
    '!packages/oui/src/test-utils/*.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 91,
      functions: 98,
      lines: 98,
    },
  },
  modulePathIgnorePatterns: ['build'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', '<rootDir>/test/setup.js'],
}
