import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { GiroRepositoryPort, GIRO_REPOSITORY_PORT } from '../../../domain/giros/ports/giro.repository.port';
import { Giro } from '../../../domain/giros/entities/giro.entity';
import { UpdateGiroDto } from '../dto/update-giro.dto';
import { GiroResponseDto } from '../dto/giro-response.dto';

@Injectable()
export class UpdateGiroUseCase {
  constructor(
    @Inject(GIRO_REPOSITORY_PORT)
    private readonly giroRepository: GiroRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateGiroDto): Promise<GiroResponseDto> {
    const giro = await this.giroRepository.findById(id);
    if (!giro) {
      throw new NotFoundException(`Giro con ID ${id} no encontrado`);
    }

    // Verificar clave única si se está actualizando
    if (dto.clave && dto.clave !== giro.clave) {
      const existingGiro = await this.giroRepository.findByClave(dto.clave);
      if (existingGiro) {
        throw new ConflictException(`Ya existe un giro con la clave: ${dto.clave}`);
      }
    }

    giro.update(dto);
    const updatedGiro = await this.giroRepository.update(id, giro);

    return this.mapToResponseDto(updatedGiro);
  }

  private mapToResponseDto(giro: Giro): GiroResponseDto {
    return {
      id: giro.id,
      clave: giro.clave,
      descripcion: giro.descripcion,
      sector: giro.sector,
      riesgo: giro.riesgo,
      activo: giro.activo,
      createdAt: giro.createdAt,
      updatedAt: giro.updatedAt,
    };
  }
}
