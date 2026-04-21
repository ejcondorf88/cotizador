import { Inject, Injectable } from '@nestjs/common';
import { AgenteRepositoryPort, AGENTE_REPOSITORY_PORT } from '../../../domain/agentes/ports/agente.repository.port';
import { Agente } from '../../../domain/agentes/entities/agente.entity';
import { SearchDto } from '../../common/dto/search.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedAgenteResponseDto, AgenteResponseDto } from '../dto/agente-response.dto';

@Injectable()
export class SearchAgentesUseCase {
  constructor(
    @Inject(AGENTE_REPOSITORY_PORT)
    private readonly agenteRepository: AgenteRepositoryPort,
  ) {}

  async execute(searchDto: SearchDto, pagination: PaginationDto): Promise<PaginatedAgenteResponseDto> {
    const { items, total } = await this.agenteRepository.search(searchDto.q, {
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
