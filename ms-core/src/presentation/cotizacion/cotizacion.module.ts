import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CotizacionController } from './cotizacion.controller';
import { CrearCotizacionUseCase } from '../../application/cotizacion/use-cases/crear-cotizacion.use-case';
import { CotizacionRepositoryAdapter } from '../../infrastructure/cotizacion/adapters/cotizacion-repository.adapter';
import { CotizacionTypeOrmEntity } from '../../infrastructure/cotizacion/entities/cotizacion.typeorm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CotizacionTypeOrmEntity]),
  ],
  controllers: [CotizacionController],
  providers: [
    CrearCotizacionUseCase,
    {
      provide: 'CotizacionRepositoryPort',
      useClass: CotizacionRepositoryAdapter,
    },
  ],
})
export class CotizacionModule {}
