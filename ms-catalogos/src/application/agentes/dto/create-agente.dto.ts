import { IsString, IsNotEmpty, MaxLength, IsEmail, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgenteDto {
  @ApiProperty({ description: 'Código único del agente', example: 'AGT001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @ApiProperty({ description: 'Nombre completo del agente', example: 'Juan Pérez García' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

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

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
