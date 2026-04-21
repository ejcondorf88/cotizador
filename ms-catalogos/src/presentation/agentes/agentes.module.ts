import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentesController } from './agentes.controller';
import { CreateAgenteUseCase } from '../../application/agentes/use-cases/create-agente.use-case';
import { GetAgentesUseCase } from '../../application/agentes/use-cases/get-agentes.use-case';
import { GetAgenteByIdUseCase } from '../../application/agentes/use-cases/get-agente-by-id.use-case';
import { SearchAgentesUseCase } from '../../application/agentes/use-cases/search-agentes.use-case';
import { UpdateAgenteUseCase } from '../../application/agentes/use-cases/update-agente.use-case';
import { DeleteAgenteUseCase } from '../../application/agentes/use-cases/delete-agente.use-case';
import { AgenteRepositoryAdapter } from '../../infrastructure/agentes/adapters/agente-repository.adapter';
import { AGENTE_REPOSITORY_PORT } from '../../domain/agentes/ports/agente.repository.port';
import { AgenteTypeOrmEntity } from '../../infrastructure/agentes/entities/agente.typeorm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgenteTypeOrmEntity])],
  controllers: [AgentesController],
  providers: [
    CreateAgenteUseCase,
    GetAgentesUseCase,
    GetAgenteByIdUseCase,
    SearchAgentesUseCase,
    UpdateAgenteUseCase,
    DeleteAgenteUseCase,
    {
      provide: AGENTE_REPOSITORY_PORT,
      useClass: AgenteRepositoryAdapter,
    },
  ],
  exports: [AGENTE_REPOSITORY_PORT],
})
export class AgentesModule {}
