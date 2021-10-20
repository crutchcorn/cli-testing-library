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
  coverageThreshold,
  watchPlugins,
  projects: [
    require.resolve('./tests/jest.config.js'),
  ],
}
