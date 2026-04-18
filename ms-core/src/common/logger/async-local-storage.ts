import { AsyncLocalStorage } from 'async_hooks';

interface Store {
  correlationId: string;
}

const asyncLocalStorage = new AsyncLocalStorage<Store>();

export function setCorrelationId(id: string): void {
  const store = asyncLocalStorage.getStore();
  if (store) {
    store.correlationId = id;
  }
}

export function getCorrelationId(): string | undefined {
  const store = asyncLocalStorage.getStore();
  return store?.correlationId;
}

export function runWithCorrelationId<T>(correlationId: string, fn: () => T): T {
  return asyncLocalStorage.run({ correlationId }, fn);
}

export { asyncLocalStorage };
