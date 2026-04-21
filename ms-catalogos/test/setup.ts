// Configuración global de Jest
import 'reflect-metadata';

// Configurar timezone consistente
process.env.TZ = 'UTC';

// Fake timers para tests de fechas
jest.useFakeTimers({ advanceTimers: true });

// Mock console.error/warn en tests para reducir ruido
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('DeprecationWarning')
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
