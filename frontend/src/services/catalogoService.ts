import axios from 'axios';
import type {
  Giro,
  Agente,
  Suscriptor,
  Oficina,
  AgenteSearchResponse,
  SuscriptorSearchResponse,
  OficinaResponse,
} from '../types/catalogo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// ========== TIPOS DE RESPUESTA DEL BACKEND ==========

interface BackendResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

interface BackendAgente {
  id: string;
  codigo: string;
  nombre: string;
  email?: string;
  telefono?: string;
  oficinaId?: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendSuscriptor {
  id: string;
  codigo: string;
  nombre: string;
  tipo?: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendOficina {
  id: string;
  codigo: string;
  nombre: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  direccion?: string;
  telefono?: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ========== GIROS ==========

export const searchGiros = async (query: string, limit = 20): Promise<Giro[]> => {
  try {
    const response = await axios.get<BackendResponse<Giro>>(
      `${API_URL}/catalogos/giros/buscar`,
      {
        params: { q: query, limit },
      }
    );
    return response.data.items || [];
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
    const response = await axios.get<BackendResponse<Giro>>(`${API_URL}/catalogos/giros`);
    return response.data.items || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching giros:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al obtener giros');
    }
    throw error;
  }
};

// ========== AGENTES ==========

// Mapea respuesta del backend a formato esperado por el frontend
const mapAgenteResponse = (agente: BackendAgente): AgenteSearchResponse => ({
  id: agente.id,
  codigo: agente.codigo,
  nombre: agente.nombre,
  email: agente.email,
  telefono: agente.telefono,
});

export const searchAgentes = async (query: string): Promise<AgenteSearchResponse[]> => {
  try {
    const response = await axios.get<BackendResponse<BackendAgente>>(
      `${API_URL}/catalogos/agentes/buscar`,
      {
        params: { q: query },
      }
    );
    return (response.data.items || []).map(mapAgenteResponse);
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
    const response = await axios.get<BackendResponse<BackendAgente>>(
      `${API_URL}/catalogos/agentes/${id}`
    );
    const agente = response.data.items?.[0];
    if (!agente) {
      throw new Error('Agente no encontrado');
    }
    return {
      id: agente.id,
      codigo: agente.codigo,
      nombre: agente.nombre,
      email: agente.email,
      telefono: agente.telefono,
      oficinaId: agente.oficinaId,
    };
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
