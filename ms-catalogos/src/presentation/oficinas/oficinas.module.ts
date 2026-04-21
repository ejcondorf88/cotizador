import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OficinasController } from './oficinas.controller';
import { CreateOficinaUseCase } from '../../application/oficinas/use-cases/create-oficina.use-case';
import { GetOficinasUseCase } from '../../application/oficinas/use-cases/get-oficinas.use-case';
import { GetOficinaByIdUseCase } from '../../application/oficinas/use-cases/get-oficina-by-id.use-case';
import { UpdateOficinaUseCase } from '../../application/oficinas/use-cases/update-oficina.use-case';
import { DeleteOficinaUseCase } from '../../application/oficinas/use-cases/delete-oficina.use-case';
import { OficinaRepositoryAdapter } from '../../infrastructure/oficinas/adapters/oficina-repository.adapter';
import { OFICINA_REPOSITORY_PORT } from '../../domain/oficinas/ports/oficina.repository.port';
import { OficinaTypeOrmEntity } from '../../infrastructure/oficinas/entities/oficina.typeorm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OficinaTypeOrmEntity])],
  controllers: [OficinasController],
  providers: [
    CreateOficinaUseCase,
    GetOficinasUseCase,
    GetOficinaByIdUseCase,
    UpdateOficinaUseCase,
    DeleteOficinaUseCase,
    {
      provide: OFICINA_REPOSITORY_PORT,
      useClass: OficinaRepositoryAdapter,
    },
  ],
  exports: [OFICINA_REPOSITORY_PORT],
})
export class OficinasModule {}
