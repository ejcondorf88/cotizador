import { IsString, IsNotEmpty, IsOptional, MaxLength, IsBoolean, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGiroDto {
  @ApiProperty({ description: 'Clave única del giro', example: '461110' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  clave: string;

  @ApiProperty({ description: 'Descripción del giro', example: 'Comercio al por mayor de abarrotes' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descripcion: string;

  @ApiPropertyOptional({ description: 'Sector al que pertenece', example: 'Comercio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sector?: string;

  @ApiPropertyOptional({ description: 'Nivel de riesgo', enum: ['BAJO', 'MEDIO', 'ALTO', 'MUY_ALTO'], default: 'MEDIO' })
  @IsOptional()
  @IsString()
  @IsIn(['BAJO', 'MEDIO', 'ALTO', 'MUY_ALTO'])
  riesgo?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
