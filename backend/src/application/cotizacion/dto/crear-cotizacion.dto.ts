import { IsOptional } from 'class-validator';

export class CrearCotizacionDto {
  @IsOptional()
  metadata?: Record<string, unknown>;
}
