const {
  collectCoverageFrom,
  coveragePathIgnorePatterns,
  coverageThreshold,
  watchPlugins,
} = require('kcd-scripts/jest')

module.exports = {
  collectCoverageFrom,
  coveragePathIgnorePatterns: [
    ...coveragePathIgnorePatterns,
    '/__tests__/',
    '/__node_tests__/',
  ],
  coverageThreshold: {
    ...coverageThreshold,
    // TODO: Remove this
    global: {
      branches: 40,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  watchPlugins,
  projects: [require.resolve('./tests/jest.config.js')],
}
