import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OficinaResponseDto {
  @ApiProperty({ description: 'ID único de la oficina' })
  id: string;

  @ApiProperty({ description: 'Código único de la oficina' })
  codigo: string;

  @ApiProperty({ description: 'Nombre de la oficina' })
  nombre: string;

  @ApiPropertyOptional({ description: 'Ciudad', nullable: true })
  ciudad: string | null;

  @ApiPropertyOptional({ description: 'Estado', nullable: true })
  estado: string | null;

  @ApiProperty({ description: 'Estado activo/inactivo' })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

export class PaginatedOficinaResponseDto {
  @ApiProperty({ description: 'Lista de oficinas', type: [OficinaResponseDto] })
  items: OficinaResponseDto[];

  @ApiProperty({ description: 'Total de registros' })
  total: number;

  @ApiProperty({ description: 'Página actual' })
  page: number;

  @ApiProperty({ description: 'Límite por página' })
  limit: number;
}
