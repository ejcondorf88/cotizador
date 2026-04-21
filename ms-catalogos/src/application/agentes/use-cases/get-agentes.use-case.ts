import { Inject, Injectable } from '@nestjs/common';
import { AgenteRepositoryPort, AGENTE_REPOSITORY_PORT } from '../../../domain/agentes/ports/agente.repository.port';
import { Agente } from '../../../domain/agentes/entities/agente.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedAgenteResponseDto, AgenteResponseDto } from '../dto/agente-response.dto';

@Injectable()
export class GetAgentesUseCase {
  constructor(
    @Inject(AGENTE_REPOSITORY_PORT)
    private readonly agenteRepository: AgenteRepositoryPort,
  ) {}

  async execute(pagination: PaginationDto): Promise<PaginatedAgenteResponseDto> {
    const { items, total } = await this.agenteRepository.findAll({
      page: pagination.page || 1,
      limit: pagination.limit || 20,
    });

    return {
      items: items.map(agente => this.mapToResponseDto(agente)),
      total,
      page: pagination.page || 1,
      limit: pagination.limit || 20,
    };
  }

  private mapToResponseDto(agente: Agente): AgenteResponseDto {
    return {
      id: agente.id,
      codigo: agente.codigo,
      nombre: agente.nombre,
      email: agente.email,
      telefono: agente.telefono,
      oficinaId: agente.oficinaId,
      activo: agente.activo,
      createdAt: agente.createdAt,
      updatedAt: agente.updatedAt,
    };
  }
}
