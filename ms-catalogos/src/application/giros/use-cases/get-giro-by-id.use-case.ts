import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GiroRepositoryPort, GIRO_REPOSITORY_PORT } from '../../../domain/giros/ports/giro.repository.port';
import { Giro } from '../../../domain/giros/entities/giro.entity';
import { GiroResponseDto } from '../dto/giro-response.dto';

@Injectable()
export class GetGiroByIdUseCase {
  constructor(
    @Inject(GIRO_REPOSITORY_PORT)
    private readonly giroRepository: GiroRepositoryPort,
  ) {}

  async execute(id: string): Promise<GiroResponseDto> {
    const giro = await this.giroRepository.findById(id);
    if (!giro) {
      throw new NotFoundException(`Giro con ID ${id} no encontrado`);
    }

    return this.mapToResponseDto(giro);
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
