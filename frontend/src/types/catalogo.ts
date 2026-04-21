// ========== CATÁLOGOS - TIPOS PARA MS-CATALOGOS ==========

export interface Giro {
  id: string;
  clave: string;
  descripcion: string;
  sector?: string;
  riesgo: 'BAJO' | 'MEDIO' | 'ALTO' | 'MUY_ALTO';
}

export interface Agente {
  id: string;
  codigo: string;
  nombre: string;
  email?: string;
  telefono?: string;
  oficinaId?: string;
  oficina?: Oficina;
  activo?: boolean;
}

export interface Suscriptor {
  id: string;
  codigo: string;
  nombre: string;
  tipo?: string;
  activo?: boolean;
}

export interface Oficina {
  id: string;
  codigo: string;
  nombre: string;
  ciudad?: string;
  estado?: string;
  activo?: boolean;
}

// ========== RESPONSES ==========

export interface CatalogoResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface GiroSearchResponse {
  id: string;
  clave: string;
  descripcion: string;
  sector?: string;
  riesgo: 'BAJO' | 'MEDIO' | 'ALTO' | 'MUY_ALTO';
}

export interface AgenteSearchResponse {
  id: string;
  codigo: string;
  nombre: string;
  email?: string;
  telefono?: string;
  oficinaId?: string;
}

export interface SuscriptorSearchResponse {
  id: string;
  codigo: string;
  nombre: string;
  tipo?: string;
}

// ========== COMPATIBILIDAD CON TIPOS EXISTENTES ==========

// Para compatibilidad con Agent existente en quote.ts
export interface AgentCatalog {
  key: string;
  name: string;
  subscriber: string;
  office: string;
}

// Para compatibilidad con ActivityOption en property.ts
export interface ActivityOptionCatalog {
  code: string;
  description: string;
}
