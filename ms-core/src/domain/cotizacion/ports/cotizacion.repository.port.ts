import { Cotizacion } from '../entities/cotizacion.entity';

export interface CotizacionRepositoryPort {
  crear(cotizacion: Cotizacion): Promise<Cotizacion>;
  obtenerUltimoFolioDelYear(year: number): Promise<number>;
}
