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

export function useCalculate(quoteId: string | undefined): UseCalculateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PremiumCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (): Promise<PremiumCalculationResult | null> => {
    if (!quoteId) {
      setError('No se proporcionó ID de cotización');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await premiumService.calculatePremium(quoteId);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error calculando la prima';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [quoteId]);

  const reset = useCallback(() => {
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
