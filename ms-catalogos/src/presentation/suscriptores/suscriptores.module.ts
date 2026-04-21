import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuscriptoresController } from './suscriptores.controller';
import { CreateSuscriptorUseCase } from '../../application/suscriptores/use-cases/create-suscriptor.use-case';
import { GetSuscriptoresUseCase } from '../../application/suscriptores/use-cases/get-suscriptores.use-case';
import { GetSuscriptorByIdUseCase } from '../../application/suscriptores/use-cases/get-suscriptor-by-id.use-case';
import { SearchSuscriptoresUseCase } from '../../application/suscriptores/use-cases/search-suscriptores.use-case';
import { UpdateSuscriptorUseCase } from '../../application/suscriptores/use-cases/update-suscriptor.use-case';
import { DeleteSuscriptorUseCase } from '../../application/suscriptores/use-cases/delete-suscriptor.use-case';
import { SuscriptorRepositoryAdapter } from '../../infrastructure/suscriptores/adapters/suscriptor-repository.adapter';
import { SUSCRIPTOR_REPOSITORY_PORT } from '../../domain/suscriptores/ports/suscriptor.repository.port';
import { SuscriptorTypeOrmEntity } from '../../infrastructure/suscriptores/entities/suscriptor.typeorm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SuscriptorTypeOrmEntity])],
  controllers: [SuscriptoresController],
  providers: [
    CreateSuscriptorUseCase,
    GetSuscriptoresUseCase,
    GetSuscriptorByIdUseCase,
    SearchSuscriptoresUseCase,
    UpdateSuscriptorUseCase,
    DeleteSuscriptorUseCase,
    {
      provide: SUSCRIPTOR_REPOSITORY_PORT,
      useClass: SuscriptorRepositoryAdapter,
    },
  ],
  exports: [SUSCRIPTOR_REPOSITORY_PORT],
})
export class SuscriptoresModule {}
