import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OficinaRepositoryPort, OFICINA_REPOSITORY_PORT } from '../../../domain/oficinas/ports/oficina.repository.port';
import { Oficina } from '../../../domain/oficinas/entities/oficina.entity';
import { OficinaResponseDto } from '../dto/oficina-response.dto';

@Injectable()
export class GetOficinaByIdUseCase {
  constructor(
    @Inject(OFICINA_REPOSITORY_PORT)
    private readonly oficinaRepository: OficinaRepositoryPort,
  ) {}

  async execute(id: string): Promise<OficinaResponseDto> {
    const oficina = await this.oficinaRepository.findById(id);
    if (!oficina) {
      throw new NotFoundException(`Oficina con ID ${id} no encontrada`);
    }

    return this.mapToResponseDto(oficina);
  }

  private mapToResponseDto(oficina: Oficina): OficinaResponseDto {
    return {
      id: oficina.id,
      codigo: oficina.codigo,
      nombre: oficina.nombre,
      ciudad: oficina.ciudad,
      estado: oficina.estado,
      activo: oficina.activo,
      createdAt: oficina.createdAt,
      updatedAt: oficina.updatedAt,
    };
  }
}
