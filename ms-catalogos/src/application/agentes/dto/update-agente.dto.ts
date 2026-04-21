import { IsString, IsOptional, MaxLength, IsEmail, IsBoolean, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAgenteDto {
  @ApiPropertyOptional({ description: 'Código único del agente', example: 'AGT001' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  codigo?: string;

  @ApiPropertyOptional({ description: 'Nombre completo del agente', example: 'Juan Pérez García' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico', example: 'juan.perez@segurax.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto', example: '5512345678' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional({ description: 'ID de la oficina asignada' })
  @IsOptional()
  @IsUUID()
  oficinaId?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
