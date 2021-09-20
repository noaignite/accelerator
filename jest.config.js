module.exports = {
  collectCoverageFrom: [
    'packages/**/*.{js,jsx}',
    '!packages/**/*.test.{js,jsx}',
    '!packages/**/index.{js,jsx}',
    '!packages/oui/src/test-utils/*.{js,jsx}',
    '!packages/oui/test/*.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 82,
      lines: 90,
      functions: 85,
    },
  },
  modulePathIgnorePatterns: ['build'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', '<rootDir>/test/setup.js'],
}
