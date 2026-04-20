import axios from 'axios';
import type { Quote, QuoteStatus, UpdateQuoteRequest, PaymentType } from '../types/quote';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const quoteService = {
  async createQuote(): Promise<Quote> {
    try {
      const response = await axios.post<Quote>(
        `${API_URL}/quotes`,
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
          throw new Error('Unable to connect to server. Please verify the backend is running.');
        }
        if (error.response?.status === 500) {
          throw new Error('Internal server error');
        }
        throw new Error(error.response?.data?.message || 'Error creating quote');
      }
      throw error;
    }
  },

  async getQuotes(): Promise<Quote[]> {
    try {
      const response = await axios.get<Quote[]>(`${API_URL}/quotes`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error fetching quotes');
      }
      throw error;
    }
  },

  async getQuotesByStatus(status: QuoteStatus): Promise<Quote[]> {
    try {
      const response = await axios.get<Quote[]>(`${API_URL}/quotes`, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error fetching quotes');
      }
      throw error;
    }
  },

  async getQuoteById(id: string): Promise<Quote> {
    try {
      const response = await axios.get<Quote>(`${API_URL}/quotes/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error fetching quote');
      }
      throw error;
    }
  },

  async updateQuote(id: string, data: UpdateQuoteRequest): Promise<Quote> {
    try {
      const response = await axios.patch<Quote>(`${API_URL}/quotes/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error updating quote');
      }
      throw error;
    }
  },
};

// Mock data for catalogs (will be replaced by API calls)
export const catalogs = {
  businessLines: [
    { id: 'construccion', name: 'Construcción' },
    { id: 'manufactura', name: 'Manufactura' },
    { id: 'comercio', name: 'Comercio' },
    { id: 'servicios', name: 'Servicios' },
    { id: 'transporte', name: 'Transporte' },
    { id: 'tecnologia', name: 'Tecnología' },
  ],

  businessTypes: {
    construccion: [
      { id: 'constructora', name: 'Constructora' },
      { id: 'desarrolladora', name: 'Desarrolladora' },
      { id: 'contratista', name: 'Contratista' },
      { id: 'subcontratista', name: 'Subcontratista' },
    ],
    manufactura: [
      { id: 'maquiladora', name: 'Maquiladora' },
      { id: 'fabricante', name: 'Fabricante' },
      { id: 'ensambladora', name: 'Ensambladora' },
      { id: 'transformadora', name: 'Transformadora' },
    ],
    comercio: [
      { id: 'minorista', name: 'Minorista' },
      { id: 'mayorista', name: 'Mayorista' },
      { id: 'tienda_dep', name: 'Tienda Departamental' },
      { id: 'supermercado', name: 'Supermercado' },
    ],
    servicios: [
      { id: 'consultoria', name: 'Consultoría' },
      { id: 'profesionales', name: 'Servicios Profesionales' },
      { id: 'turismo', name: 'Turismo' },
      { id: 'salud', name: 'Salud' },
    ],
    transporte: [
      { id: 'carga', name: 'Transporte de Carga' },
      { id: 'pasajeros', name: 'Transporte de Pasajeros' },
      { id: 'logistica', name: 'Logística' },
      { id: 'mensajeria', name: 'Mensajería' },
    ],
    tecnologia: [
      { id: 'software', name: 'Desarrollo de Software' },
      { id: 'servicios_it', name: 'Servicios IT' },
      { id: 'telecom', name: 'Telecomunicaciones' },
      { id: 'ecommerce', name: 'E-commerce' },
    ],
  },

  agents: [
    {
      key: 'AGT-001234',
      name: 'Juan Pérez García',
      subscriber: 'María González',
      office: 'Sucursal Centro CDMX',
    },
    {
      key: 'AGT-002345',
      name: 'Ana López Martínez',
      subscriber: 'Carlos Rodríguez',
      office: 'Sucursal Polanco',
    },
    {
      key: 'AGT-003456',
      name: 'Pedro Sánchez Torres',
      subscriber: 'Laura Hernández',
      office: 'Sucursal Santa Fe',
    },
    {
      key: 'AGT-004567',
      name: 'Carmen Díaz Ruiz',
      subscriber: 'Roberto Jiménez',
      office: 'Sucursal Coyoacán',
    },
    {
      key: 'AGT-005678',
      name: 'Luis García Morales',
      subscriber: 'Patricia Flores',
      office: 'Sucursal Tlalnepantla',
    },
  ],

  currencies: [
    { value: 'MXN', label: '💲 Pesos Mexicanos (MXN)' },
    { value: 'USD', label: '💵 Dólares (USD)' },
  ],

  paymentTypes: [
    { value: 'CONTADO' as PaymentType, label: '💰 Contado' },
    { value: 'MENSUAL' as PaymentType, label: '📅 Mensual' },
    { value: 'TRIMESTRAL' as PaymentType, label: '📆 Trimestral' },
    { value: 'SEMESTRAL' as PaymentType, label: '📋 Semestral' },
    { value: 'ANUAL' as PaymentType, label: '📘 Anual' },
  ],
};

// Helper functions
export const searchAgents = (query: string) => {
  const normalizedQuery = query.toLowerCase();
  return catalogs.agents.filter(
    (agent) =>
      agent.key.toLowerCase().includes(normalizedQuery) ||
      agent.name.toLowerCase().includes(normalizedQuery)
  );
};

export const getAgentByKey = (key: string) => {
  return catalogs.agents.find((agent) => agent.key === key);
};

export const getBusinessTypes = (businessLineId: string) => {
  return catalogs.businessTypes[businessLineId as keyof typeof catalogs.businessTypes] || [];
};

export const validateRFC = (rfc: string): boolean => {
  // RFC validation for Mexican tax ID
  // Format: 3-4 letters + 6 digits (YYMMDD) + 2-3 alphanumeric (homoclave)
  const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2,3}$/i;
  return rfcRegex.test(rfc.toUpperCase());
};

export const formatRFC = (rfc: string): string => {
  return rfc.toUpperCase().trim();
};
