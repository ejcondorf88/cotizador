import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { OficinaRepositoryPort, OFICINA_REPOSITORY_PORT } from '../../../domain/oficinas/ports/oficina.repository.port';
import { Oficina } from '../../../domain/oficinas/entities/oficina.entity';
import { CreateOficinaDto } from '../dto/create-oficina.dto';
import { OficinaResponseDto } from '../dto/oficina-response.dto';

@Injectable()
export class CreateOficinaUseCase {
  constructor(
    @Inject(OFICINA_REPOSITORY_PORT)
    private readonly oficinaRepository: OficinaRepositoryPort,
  ) {}

  async execute(dto: CreateOficinaDto): Promise<OficinaResponseDto> {
    // Verificar si ya existe una oficina con el mismo código
    const existingOficina = await this.oficinaRepository.findByCodigo(dto.codigo);
    if (existingOficina) {
      throw new ConflictException(`Ya existe una oficina con el código: ${dto.codigo}`);
    }

    const oficina = Oficina.create(dto);
    const savedOficina = await this.oficinaRepository.create(oficina);

    return this.mapToResponseDto(savedOficina);
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
