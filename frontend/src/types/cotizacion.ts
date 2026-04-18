export interface Cotizacion {
  id: string;
  numeroFolio: string;
  estado: 'BORRADOR' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CrearCotizacionRequest {
  // Vacío por ahora
}

export interface CrearCotizacionResponse {
  id: string;
  numeroFolio: string;
  estado: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}
