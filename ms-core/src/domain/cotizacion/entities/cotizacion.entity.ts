import { v4 as uuid } from 'uuid';

export class Cotizacion {
  constructor(
    public readonly id: string,
    public readonly numeroFolio: string,
    public estado: string,
    public readonly fechaCreacion: Date,
    public fechaActualizacion: Date,
  ) {}

  static crear(numeroFolio: string): Cotizacion {
    return new Cotizacion(
      uuid(),
      numeroFolio,
      'BORRADOR',
      new Date(),
      new Date(),
    );
  }
}
