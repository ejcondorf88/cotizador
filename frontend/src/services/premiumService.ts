import axios from 'axios';
import type { PremiumCalculationResult } from '../types/premium.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const premiumService = {
  async calculatePremium(quoteId: string): Promise<PremiumCalculationResult> {
    try {
      const response = await axios.post<PremiumCalculationResult>(
        `${API_URL}/quotes/${quoteId}/calculate`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'Error calculando la prima';
        
        if (status === 404) {
          throw new Error('Cotización no encontrada');
        }
        if (status === 409) {
          throw new Error('Versión desactualizada. Por favor, recarga la página');
        }
        if (status === 422) {
          throw new Error(message || 'No hay inmuebles con datos suficientes para calcular la prima');
        }
        throw new Error(message);
      }
      throw error;
    }
  },

  async getPremiumResult(quoteId: string): Promise<PremiumCalculationResult> {
    try {
      const response = await axios.get<PremiumCalculationResult>(
        `${API_URL}/quotes/${quoteId}/premium`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error obteniendo el resultado de la prima');
      }
      throw error;
    }
  },
};
