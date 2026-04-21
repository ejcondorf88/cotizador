import { ApiProperty } from '@nestjs/swagger';

export class GiroResponseDto {
  @ApiProperty({ description: 'ID único del giro' })
  id: string;

  @ApiProperty({ description: 'Clave única del giro' })
  clave: string;

  @ApiProperty({ description: 'Descripción del giro' })
  descripcion: string;

  @ApiProperty({ description: 'Sector al que pertenece', nullable: true })
  sector: string | null;

  @ApiProperty({ description: 'Nivel de riesgo' })
  riesgo: string;

  @ApiProperty({ description: 'Estado activo/inactivo' })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

export class PaginatedGiroResponseDto {
  @ApiProperty({ description: 'Lista de giros', type: [GiroResponseDto] })
  items: GiroResponseDto[];

  @ApiProperty({ description: 'Total de registros' })
  total: number;

  @ApiProperty({ description: 'Página actual' })
  page: number;

  @ApiProperty({ description: 'Límite por página' })
  limit: number;
}
