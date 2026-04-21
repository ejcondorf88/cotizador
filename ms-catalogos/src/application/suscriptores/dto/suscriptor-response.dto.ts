import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SuscriptorResponseDto {
  @ApiProperty({ description: 'ID único del suscriptor' })
  id: string;

  @ApiProperty({ description: 'Código único del suscriptor' })
  codigo: string;

  @ApiProperty({ description: 'Nombre completo del suscriptor' })
  nombre: string;

  @ApiPropertyOptional({ description: 'Tipo de suscriptor', nullable: true })
  tipo: string | null;

  @ApiProperty({ description: 'Estado activo/inactivo' })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

export class PaginatedSuscriptorResponseDto {
  @ApiProperty({ description: 'Lista de suscriptores', type: [SuscriptorResponseDto] })
  items: SuscriptorResponseDto[];

  @ApiProperty({ description: 'Total de registros' })
  total: number;

  @ApiProperty({ description: 'Página actual' })
  page: number;

  @ApiProperty({ description: 'Límite por página' })
  limit: number;
}
