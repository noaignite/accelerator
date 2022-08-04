module.exports = {
  collectCoverageFrom: [
    'packages/**/*.{js,jsx,ts,tsx}',
    '!packages/**/*.test.{js,jsx,ts,tsx}',
    '!packages/**/test/*.{js,jsx,ts,tsx}',
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
