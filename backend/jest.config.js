/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ["text", "text-summary", "cobertura", "html"],
  coverageDirectory: './__tests__/coverage'};