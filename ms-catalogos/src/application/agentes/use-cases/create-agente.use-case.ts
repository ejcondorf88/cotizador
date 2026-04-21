import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { AgenteRepositoryPort, AGENTE_REPOSITORY_PORT } from '../../../domain/agentes/ports/agente.repository.port';
import { Agente } from '../../../domain/agentes/entities/agente.entity';
import { CreateAgenteDto } from '../dto/create-agente.dto';
import { AgenteResponseDto } from '../dto/agente-response.dto';

@Injectable()
export class CreateAgenteUseCase {
  constructor(
    @Inject(AGENTE_REPOSITORY_PORT)
    private readonly agenteRepository: AgenteRepositoryPort,
  ) {}

  async execute(dto: CreateAgenteDto): Promise<AgenteResponseDto> {
    // Verificar si ya existe un agente con el mismo código
    const existingAgente = await this.agenteRepository.findByCodigo(dto.codigo);
    if (existingAgente) {
      throw new ConflictException(`Ya existe un agente con el código: ${dto.codigo}`);
    }

    const agente = Agente.create(dto);
    const savedAgente = await this.agenteRepository.create(agente);

    return this.mapToResponseDto(savedAgente);
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
