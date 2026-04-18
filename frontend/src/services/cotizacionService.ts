import axios from 'axios';
import type { Cotizacion } from '../types/cotizacion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const cotizacionService = {
  async crearCotizacion(): Promise<Cotizacion> {
    try {
      const response = await axios.post<Cotizacion>(
        `${API_URL}/api/v1/cotizaciones`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('No se pudo conectar con el servidor. Verifique que el backend esté corriendo.');
        }
        if (error.response?.status === 500) {
          throw new Error('Error interno del servidor');
        }
        throw new Error(error.response?.data?.message || 'Error al crear cotización');
      }
      throw error;
    }
  },
};
