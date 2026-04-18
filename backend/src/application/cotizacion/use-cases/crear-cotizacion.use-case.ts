import { Injectable, Inject } from '@nestjs/common';
import { Cotizacion } from '../../../domain/cotizacion/entities/cotizacion.entity';
import { CotizacionRepositoryPort } from '../../../domain/cotizacion/ports/cotizacion.repository.port';

@Injectable()
export class CrearCotizacionUseCase {
  constructor(
    @Inject('CotizacionRepositoryPort')
    private readonly cotizacionRepo: CotizacionRepositoryPort,
  ) {}

  async execute(): Promise<Cotizacion> {
    const year = new Date().getFullYear();
    const ultimoNumero = await this.cotizacionRepo.obtenerUltimoFolioDelYear(year);
    const numeroFolio = `COT-${year}-${String(ultimoNumero + 1).padStart(5, '0')}`;
    
    const cotizacion = Cotizacion.crear(numeroFolio);
    return this.cotizacionRepo.crear(cotizacion);
  }
}
