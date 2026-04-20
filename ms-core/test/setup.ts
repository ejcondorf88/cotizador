/**
 * Jest Global Setup
 *
 * Configuración global para todos los tests.
 * Se ejecuta después de que el test environment está listo
 * pero antes de que corran los tests.
 */

// Extend Jest matchers if needed
// import '@testing-library/jest-dom/extend-expect';

// Global mocks for console during tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests:
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Set default timeout for all tests
jest.setTimeout(10000);

// Global beforeAll / afterAll if needed
beforeAll(async () => {
  // Global setup before all tests
});

afterAll(async () => {
  // Global cleanup after all tests
});
