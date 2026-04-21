import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty({ description: 'Término de búsqueda', minLength: 1 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  q: string;
}
