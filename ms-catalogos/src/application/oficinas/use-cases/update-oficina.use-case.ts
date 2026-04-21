import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { OficinaRepositoryPort, OFICINA_REPOSITORY_PORT } from '../../../domain/oficinas/ports/oficina.repository.port';
import { Oficina } from '../../../domain/oficinas/entities/oficina.entity';
import { UpdateOficinaDto } from '../dto/update-oficina.dto';
import { OficinaResponseDto } from '../dto/oficina-response.dto';

@Injectable()
export class UpdateOficinaUseCase {
  constructor(
    @Inject(OFICINA_REPOSITORY_PORT)
    private readonly oficinaRepository: OficinaRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateOficinaDto): Promise<OficinaResponseDto> {
    const oficina = await this.oficinaRepository.findById(id);
    if (!oficina) {
      throw new NotFoundException(`Oficina con ID ${id} no encontrada`);
    }

    // Verificar código único si se está actualizando
    if (dto.codigo && dto.codigo !== oficina.codigo) {
      const existingOficina = await this.oficinaRepository.findByCodigo(dto.codigo);
      if (existingOficina) {
        throw new ConflictException(`Ya existe una oficina con el código: ${dto.codigo}`);
      }
    }

    oficina.update(dto);
    const updatedOficina = await this.oficinaRepository.update(id, oficina);

    return this.mapToResponseDto(updatedOficina);
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
