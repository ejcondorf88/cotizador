import { useState, useCallback } from 'react';
import { premiumService } from '../services/premiumService';
import type { PremiumCalculationResult } from '../types/premium.types';

interface UseCalculateReturn {
  calculate: () => Promise<PremiumCalculationResult | null>;
  isLoading: boolean;
  result: PremiumCalculationResult | null;
  error: string | null;
  reset: () => void;
}

const log = (level: 'info' | 'error' | 'warn', component: string, action: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] [${component}] ${action}`, data || '');
};

export function useCalculate(quoteId: string | undefined): UseCalculateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PremiumCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (): Promise<PremiumCalculationResult | null> => {
    log('info', 'useCalculate', 'calculate() - Iniciando', { quoteId });

    if (!quoteId) {
      const msg = 'No se proporcionó ID de cotización';
      log('error', 'useCalculate', 'calculate() - Error: No quoteId', { quoteId });
      setError(msg);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      log('info', 'useCalculate', 'calculate() - Llamando a premiumService.calculatePremium', { quoteId });
      const response = await premiumService.calculatePremium(quoteId);
      log('info', 'useCalculate', 'calculate() - Respuesta recibida', {
        folio: response.folio,
        status: response.status,
        netPremium: response.netPremium,
        commercialPremium: response.commercialPremium,
        propertiesCount: response.properties.length,
      });
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error calculando la prima';
      log('error', 'useCalculate', 'calculate() - Error', { error: errorMessage });
      setError(errorMessage);
      return null;
    } finally {
      log('info', 'useCalculate', 'calculate() - Finalizado', { isLoading: false });
      setIsLoading(false);
    }
  }, [quoteId]);

  const reset = useCallback(() => {
    log('info', 'useCalculate', 'reset() - Limpiando estado');
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    calculate,
    isLoading,
    result,
    error,
    reset,
  };
}
