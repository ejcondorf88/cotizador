import { IsString, IsOptional, MaxLength, IsBoolean, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGiroDto {
  @ApiPropertyOptional({ description: 'Clave única del giro', example: '461110' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  clave?: string;

  @ApiPropertyOptional({ description: 'Descripción del giro', example: 'Comercio al por mayor de abarrotes' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Sector al que pertenece', example: 'Comercio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sector?: string;

  @ApiPropertyOptional({ description: 'Nivel de riesgo', enum: ['BAJO', 'MEDIO', 'ALTO', 'MUY_ALTO'] })
  @IsOptional()
  @IsString()
  @IsIn(['BAJO', 'MEDIO', 'ALTO', 'MUY_ALTO'])
  riesgo?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
