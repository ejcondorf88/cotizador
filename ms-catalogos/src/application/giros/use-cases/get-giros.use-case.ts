import { Inject, Injectable } from '@nestjs/common';
import { GiroRepositoryPort, GIRO_REPOSITORY_PORT } from '../../../domain/giros/ports/giro.repository.port';
import { Giro } from '../../../domain/giros/entities/giro.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedGiroResponseDto, GiroResponseDto } from '../dto/giro-response.dto';

@Injectable()
export class GetGirosUseCase {
  constructor(
    @Inject(GIRO_REPOSITORY_PORT)
    private readonly giroRepository: GiroRepositoryPort,
  ) {}

  async execute(pagination: PaginationDto): Promise<PaginatedGiroResponseDto> {
    const { items, total } = await this.giroRepository.findAll({
      page: pagination.page || 1,
      limit: pagination.limit || 20,
    });

    return {
      items: items.map(giro => this.mapToResponseDto(giro)),
      total,
      page: pagination.page || 1,
      limit: pagination.limit || 20,
    };
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
