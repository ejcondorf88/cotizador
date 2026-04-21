import axios from 'axios';
import type {
  Giro,
  Agente,
  Suscriptor,
  Oficina,
  AgenteSearchResponse,
  SuscriptorSearchResponse,
} from '../types/catalogo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// ========== GIROS ==========

export const searchGiros = async (query: string, limit = 20): Promise<Giro[]> => {
  try {
    const response = await axios.get<{ data: Giro[] }>(
      `${API_URL}/catalogos/giros/buscar`,
      {
        params: { q: query, limit },
      }
    );
    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error searching giros:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al buscar giros');
    }
    throw error;
  }
};

export const getGiros = async (): Promise<Giro[]> => {
  try {
    const response = await axios.get<{ data: Giro[] }>(`${API_URL}/catalogos/giros`);
    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching giros:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al obtener giros');
    }
    throw error;
  }
};

// ========== AGENTES ==========

export const searchAgentes = async (query: string): Promise<AgenteSearchResponse[]> => {
  try {
    const response = await axios.get<{ data: AgenteSearchResponse[] }>(
      `${API_URL}/catalogos/agentes/buscar`,
      {
        params: { q: query },
      }
    );
    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error searching agentes:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al buscar agentes');
    }
    throw error;
  }
};

export const getAgenteById = async (id: string): Promise<Agente> => {
  try {
    const response = await axios.get<{ data: Agente }>(
      `${API_URL}/catalogos/agentes/${id}`
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching agente:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al obtener agente');
    }
    throw error;
  }
};

// ========== SUSCRIPTORES ==========

export const searchSuscriptores = async (query: string): Promise<SuscriptorSearchResponse[]> => {
  try {
    const response = await axios.get<{ data: SuscriptorSearchResponse[] }>(
      `${API_URL}/catalogos/suscriptores/buscar`,
      {
        params: { q: query },
      }
    );
    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error searching suscriptores:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al buscar suscriptores');
    }
    throw error;
  }
};

export const getSuscriptorById = async (id: string): Promise<Suscriptor> => {
  try {
    const response = await axios.get<{ data: Suscriptor }>(
      `${API_URL}/catalogos/suscriptores/${id}`
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching suscriptor:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al obtener suscriptor');
    }
    throw error;
  }
};

// ========== OFICINAS ==========

export const getOficinas = async (): Promise<Oficina[]> => {
  try {
    const response = await axios.get<{ data: Oficina[] }>(
      `${API_URL}/catalogos/oficinas`
    );
    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching oficinas:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al obtener oficinas');
    }
    throw error;
  }
};

export const getOficinaById = async (id: string): Promise<Oficina> => {
  try {
    const response = await axios.get<{ data: Oficina }>(
      `${API_URL}/catalogos/oficinas/${id}`
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching oficina:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al obtener oficina');
    }
    throw error;
  }
};

// ========== SERVICIO CONSOLIDADO ==========

export const catalogoService = {
  // Giros
  searchGiros,
  getGiros,

  // Agentes
  searchAgentes,
  getAgenteById,

  // Suscriptores
  searchSuscriptores,
  getSuscriptorById,

  // Oficinas
  getOficinas,
  getOficinaById,
};

export default catalogoService;
