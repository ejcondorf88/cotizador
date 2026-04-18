import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cotizacion } from '../../types/cotizacion';

interface CotizacionState {
  // Estado local de UI
  mostrarDetalles: boolean;
  cotizacionSeleccionada: Cotizacion | null;

  // Acciones
  setMostrarDetalles: (mostrar: boolean) => void;
  seleccionarCotizacion: (cotizacion: Cotizacion | null) => void;
}

export const useCotizacionStore = create<CotizacionState>()(
  persist(
    (set) => ({
      mostrarDetalles: false,
      cotizacionSeleccionada: null,
      setMostrarDetalles: (mostrar) => set({ mostrarDetalles: mostrar }),
      seleccionarCotizacion: (cotizacion) => set({ cotizacionSeleccionada: cotizacion }),
    }),
    {
      name: 'cotizacion-storage',
    }
  )
);
