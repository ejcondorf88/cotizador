import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { GiroRepositoryPort, GIRO_REPOSITORY_PORT } from '../../../domain/giros/ports/giro.repository.port';
import { Giro } from '../../../domain/giros/entities/giro.entity';
import { CreateGiroDto } from '../dto/create-giro.dto';
import { GiroResponseDto } from '../dto/giro-response.dto';

@Injectable()
export class CreateGiroUseCase {
  constructor(
    @Inject(GIRO_REPOSITORY_PORT)
    private readonly giroRepository: GiroRepositoryPort,
  ) {}

  async execute(dto: CreateGiroDto): Promise<GiroResponseDto> {
    // Verificar si ya existe un giro con la misma clave
    const existingGiro = await this.giroRepository.findByClave(dto.clave);
    if (existingGiro) {
      throw new ConflictException(`Ya existe un giro con la clave: ${dto.clave}`);
    }

    const giro = Giro.create(dto);
    const savedGiro = await this.giroRepository.create(giro);

    return this.mapToResponseDto(savedGiro);
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
