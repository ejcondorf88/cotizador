import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AgenteRepositoryPort, AGENTE_REPOSITORY_PORT } from '../../../domain/agentes/ports/agente.repository.port';
import { Agente } from '../../../domain/agentes/entities/agente.entity';
import { UpdateAgenteDto } from '../dto/update-agente.dto';
import { AgenteResponseDto } from '../dto/agente-response.dto';

@Injectable()
export class UpdateAgenteUseCase {
  constructor(
    @Inject(AGENTE_REPOSITORY_PORT)
    private readonly agenteRepository: AgenteRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateAgenteDto): Promise<AgenteResponseDto> {
    const agente = await this.agenteRepository.findById(id);
    if (!agente) {
      throw new NotFoundException(`Agente con ID ${id} no encontrado`);
    }

    // Verificar código único si se está actualizando
    if (dto.codigo && dto.codigo !== agente.codigo) {
      const existingAgente = await this.agenteRepository.findByCodigo(dto.codigo);
      if (existingAgente) {
        throw new ConflictException(`Ya existe un agente con el código: ${dto.codigo}`);
      }
    }

    agente.update(dto);
    const updatedAgente = await this.agenteRepository.update(id, agente);

    return this.mapToResponseDto(updatedAgente);
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
