import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AgenteRepositoryPort, AGENTE_REPOSITORY_PORT } from '../../../domain/agentes/ports/agente.repository.port';
import { Agente } from '../../../domain/agentes/entities/agente.entity';
import { AgenteResponseDto } from '../dto/agente-response.dto';

@Injectable()
export class GetAgenteByIdUseCase {
  constructor(
    @Inject(AGENTE_REPOSITORY_PORT)
    private readonly agenteRepository: AgenteRepositoryPort,
  ) {}

  async execute(id: string): Promise<AgenteResponseDto> {
    const agente = await this.agenteRepository.findById(id);
    if (!agente) {
      throw new NotFoundException(`Agente con ID ${id} no encontrado`);
    }

    return this.mapToResponseDto(agente);
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
