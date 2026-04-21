import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GirosController } from './giros.controller';
import { CreateGiroUseCase } from '../../application/giros/use-cases/create-giro.use-case';
import { GetGirosUseCase } from '../../application/giros/use-cases/get-giros.use-case';
import { GetGiroByIdUseCase } from '../../application/giros/use-cases/get-giro-by-id.use-case';
import { SearchGirosUseCase } from '../../application/giros/use-cases/search-giros.use-case';
import { UpdateGiroUseCase } from '../../application/giros/use-cases/update-giro.use-case';
import { DeleteGiroUseCase } from '../../application/giros/use-cases/delete-giro.use-case';
import { GiroRepositoryAdapter } from '../../infrastructure/giros/adapters/giro-repository.adapter';
import { GIRO_REPOSITORY_PORT } from '../../domain/giros/ports/giro.repository.port';
import { GiroTypeOrmEntity } from '../../infrastructure/giros/entities/giro.typeorm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GiroTypeOrmEntity])],
  controllers: [GirosController],
  providers: [
    CreateGiroUseCase,
    GetGirosUseCase,
    GetGiroByIdUseCase,
    SearchGirosUseCase,
    UpdateGiroUseCase,
    DeleteGiroUseCase,
    {
      provide: GIRO_REPOSITORY_PORT,
      useClass: GiroRepositoryAdapter,
    },
  ],
  exports: [GIRO_REPOSITORY_PORT],
})
export class GirosModule {}
