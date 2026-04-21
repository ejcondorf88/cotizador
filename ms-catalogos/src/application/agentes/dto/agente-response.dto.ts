import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AgenteResponseDto {
  @ApiProperty({ description: 'ID único del agente' })
  id: string;

  @ApiProperty({ description: 'Código único del agente' })
  codigo: string;

  @ApiProperty({ description: 'Nombre completo del agente' })
  nombre: string;

  @ApiPropertyOptional({ description: 'Correo electrónico', nullable: true })
  email: string | null;

  @ApiPropertyOptional({ description: 'Teléfono de contacto', nullable: true })
  telefono: string | null;

  @ApiPropertyOptional({ description: 'ID de la oficina asignada', nullable: true })
  oficinaId: string | null;

  @ApiProperty({ description: 'Estado activo/inactivo' })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

export class PaginatedAgenteResponseDto {
  @ApiProperty({ description: 'Lista de agentes', type: [AgenteResponseDto] })
  items: AgenteResponseDto[];

  @ApiProperty({ description: 'Total de registros' })
  total: number;

  @ApiProperty({ description: 'Página actual' })
  page: number;

  @ApiProperty({ description: 'Límite por página' })
  limit: number;
}
