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
  moduleNameMapper: {
    '^@oakwood/oui-utils(.*)$': '<rootDir>/packages/oui-utils/src$1',
  },
  modulePathIgnorePatterns: ['build'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', '<rootDir>/test/setup.js'],
}
