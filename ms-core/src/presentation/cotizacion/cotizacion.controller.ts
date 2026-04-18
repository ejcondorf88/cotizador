import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CrearCotizacionUseCase } from '../../application/cotizacion/use-cases/crear-cotizacion.use-case';
import { CotizacionMapper } from '../../infrastructure/cotizacion/mappers/cotizacion.mapper';
import { CotizacionResponseDto } from '../../application/cotizacion/dto/cotizacion-response.dto';

@Controller('cotizaciones')
export class CotizacionController {
  constructor(
    private readonly crearCotizacionUseCase: CrearCotizacionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(): Promise<CotizacionResponseDto> {
    const cotizacion = await this.crearCotizacionUseCase.execute();
    return CotizacionMapper.toResponseDto(cotizacion);
  }
}
