module.exports = {
  collectCoverageFrom: [
    'packages/**/*.{js,jsx}',
    '!packages/**/*.test.{js,jsx}',
    '!packages/**/index.{js,jsx}',
    '!packages/**/test/*.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      lines: 70,
      functions: 70,
    },
  },
  modulePathIgnorePatterns: ['build'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', '<rootDir>/test/setup.js'],
}
