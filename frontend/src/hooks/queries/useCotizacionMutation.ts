import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cotizacionService } from '../../services/cotizacionService';
import type { Cotizacion } from '../../types/cotizacion';

export const COTIZACIONES_KEY = 'cotizaciones';

export function useCotizacionMutation() {
  const queryClient = useQueryClient();

  return useMutation<Cotizacion, Error>({
    mutationFn: cotizacionService.crearCotizacion,
    retry: 3,
    onSuccess: (data) => {
      // Invalidar cache si es necesario
      queryClient.invalidateQueries({ queryKey: [COTIZACIONES_KEY] });

      // O setear directamente
      queryClient.setQueryData([COTIZACIONES_KEY, data.id], data);
    },
    onError: (error) => {
      console.error('Error al crear cotización:', error);
    },
  });
}
