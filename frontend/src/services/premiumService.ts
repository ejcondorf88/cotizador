import axios from 'axios';
import type { PremiumCalculationResult } from '../types/premium.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const log = (level: 'info' | 'error' | 'warn', component: string, action: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] [${component}] ${action}`, data || '');
};

export const premiumService = {
  async calculatePremium(quoteId: string): Promise<PremiumCalculationResult> {
    log('info', 'PremiumService', `POST /quotes/${quoteId}/calculate - Iniciando`);
    try {
      const response = await axios.post<PremiumCalculationResult>(
        `${API_URL}/quotes/${quoteId}/calculate`
      );
      log('info', 'PremiumService', `POST /quotes/${quoteId}/calculate - Éxito`, {
        status: response.status,
        netPremium: response.data.netPremium,
        commercialPremium: response.data.commercialPremium,
      });
      return response.data;
    } catch (error) {
      log('error', 'PremiumService', `POST /quotes/${quoteId}/calculate - Error`, error);
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
    log('info', 'PremiumService', `GET /quotes/${quoteId}/premium - Iniciando`);
    try {
      const response = await axios.get<PremiumCalculationResult>(
        `${API_URL}/quotes/${quoteId}/premium`
      );
      log('info', 'PremiumService', `GET /quotes/${quoteId}/premium - Éxito`, {
        status: response.status,
        netPremium: response.data.netPremium,
        commercialPremium: response.data.commercialPremium,
      });
      return response.data;
    } catch (error) {
      log('error', 'PremiumService', `GET /quotes/${quoteId}/premium - Error`, error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error obteniendo el resultado de la prima');
      }
      throw error;
    }
  },
};
