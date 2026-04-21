import { useQuery } from '@tanstack/react-query';
import {
  searchGiros,
  searchAgentes,
  searchSuscriptores,
  getOficinas,
} from '../services/catalogoService';
import type {
  Giro,
  AgenteSearchResponse,
  SuscriptorSearchResponse,
  Oficina,
} from '../types/catalogo';

// ========== QUERY KEYS ==========

export const CATALOGOS_KEYS = {
  giros: (query: string) => ['giros', query] as const,
  agentes: (query: string) => ['agentes', query] as const,
  suscriptores: (query: string) => ['suscriptores', query] as const,
  oficinas: () => ['oficinas'] as const,
} as const;

// ========== GIROS ==========

/**
 * Hook para buscar giros con autocomplete
 * - Mínimo 3 caracteres para activar búsqueda
 * - Cache de 24 horas (catálogo estático)
 */
export function useGirosAutocomplete(query: string, limit = 20) {
  return useQuery<Giro[], Error>({
    queryKey: CATALOGOS_KEYS.giros(query),
    queryFn: () => searchGiros(query, limit),
    enabled: query.length >= 3,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
    gcTime: 24 * 60 * 60 * 1000, // 24 horas (antes cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// ========== AGENTES ==========

/**
 * Hook para buscar agentes con autocomplete
 * - Mínimo 2 caracteres para activar búsqueda
 * - Cache de 1 hora
 */
export function useAgentesAutocomplete(query: string) {
  return useQuery<AgenteSearchResponse[], Error>({
    queryKey: CATALOGOS_KEYS.agentes(query),
    queryFn: () => searchAgentes(query),
    enabled: query.length >= 2,
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 60 * 60 * 1000, // 1 hora
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// ========== SUSCRIPTORES ==========

/**
 * Hook para buscar suscriptores con autocomplete
 * - Mínimo 2 caracteres para activar búsqueda
 * - Cache de 1 hora
 */
export function useSuscriptoresAutocomplete(query: string) {
  return useQuery<SuscriptorSearchResponse[], Error>({
    queryKey: CATALOGOS_KEYS.suscriptores(query),
    queryFn: () => searchSuscriptores(query),
    enabled: query.length >= 2,
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 60 * 60 * 1000, // 1 hora
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// ========== OFICINAS ==========

/**
 * Hook para obtener todas las oficinas
 * - Se carga al montar el componente
 * - Cache de 1 hora
 */
export function useOficinas() {
  return useQuery<Oficina[], Error>({
    queryKey: CATALOGOS_KEYS.oficinas(),
    queryFn: getOficinas,
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 60 * 60 * 1000, // 1 hora
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

// ========== HOOK CONSOLIDADO ==========

export const useCatalogos = {
  useGirosAutocomplete,
  useAgentesAutocomplete,
  useSuscriptoresAutocomplete,
  useOficinas,
};

export default useCatalogos;
