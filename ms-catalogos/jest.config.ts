import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/main.ts',
    '!**/*.module.ts',
    '!**/migrations/**',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './domain/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './application/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './infrastructure/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['../test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testTimeout: 30000, // 30s para TestContainers
  verbose: true,
};

export default config;
