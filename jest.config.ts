module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/types/**",
    "!src/index.ts"
  ],
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
transform: {
  '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
},
  transformIgnorePatterns: [
    "/node_modules/(?!uuid)/"
  ],
};