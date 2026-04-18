import { useState, useCallback } from 'react';
import { cotizacionService } from '../services/cotizacionService';
import type { Cotizacion } from '../types/cotizacion';

interface UseCrearCotizacionReturn {
  cotizacion: Cotizacion | null;
  loading: boolean;
  error: string | null;
  crearCotizacion: () => Promise<void>;
  reset: () => void;
}

export function useCrearCotizacion(): UseCrearCotizacionReturn {
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearCotizacion = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const nuevaCotizacion = await cotizacionService.crearCotizacion();
      setCotizacion(nuevaCotizacion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCotizacion(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCotizacion(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    cotizacion,
    loading,
    error,
    crearCotizacion,
    reset,
  };
}
