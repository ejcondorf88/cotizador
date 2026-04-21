import { Inject, Injectable } from '@nestjs/common';
import { OficinaRepositoryPort, OFICINA_REPOSITORY_PORT } from '../../../domain/oficinas/ports/oficina.repository.port';
import { Oficina } from '../../../domain/oficinas/entities/oficina.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedOficinaResponseDto, OficinaResponseDto } from '../dto/oficina-response.dto';

@Injectable()
export class GetOficinasUseCase {
  constructor(
    @Inject(OFICINA_REPOSITORY_PORT)
    private readonly oficinaRepository: OficinaRepositoryPort,
  ) {}

  async execute(pagination: PaginationDto): Promise<PaginatedOficinaResponseDto> {
    const { items, total } = await this.oficinaRepository.findAll({
      page: pagination.page || 1,
      limit: pagination.limit || 20,
    });

    return {
      items: items.map(oficina => this.mapToResponseDto(oficina)),
      total,
      page: pagination.page || 1,
      limit: pagination.limit || 20,
    };
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
