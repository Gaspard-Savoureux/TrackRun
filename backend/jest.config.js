/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['text', 'text-summary', 'cobertura', 'html'],
};

process.env.NODE_ENV = 'test';
