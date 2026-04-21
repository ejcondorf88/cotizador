import { Inject, Injectable } from '@nestjs/common';
import { SuscriptorRepositoryPort, SUSCRIPTOR_REPOSITORY_PORT } from '../../../domain/suscriptores/ports/suscriptor.repository.port';
import { Suscriptor } from '../../../domain/suscriptores/entities/suscriptor.entity';
import { SearchDto } from '../../common/dto/search.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedSuscriptorResponseDto, SuscriptorResponseDto } from '../dto/suscriptor-response.dto';

@Injectable()
export class SearchSuscriptoresUseCase {
  constructor(
    @Inject(SUSCRIPTOR_REPOSITORY_PORT)
    private readonly suscriptorRepository: SuscriptorRepositoryPort,
  ) {}

  async execute(searchDto: SearchDto, pagination: PaginationDto): Promise<PaginatedSuscriptorResponseDto> {
    const { items, total } = await this.suscriptorRepository.search(searchDto.q, {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
    });

    return {
      items: items.map(suscriptor => this.mapToResponseDto(suscriptor)),
      total,
      page: pagination.page || 1,
      limit: pagination.limit || 20,
    };
  }

  private mapToResponseDto(suscriptor: Suscriptor): SuscriptorResponseDto {
    return {
      id: suscriptor.id,
      codigo: suscriptor.codigo,
      nombre: suscriptor.nombre,
      tipo: suscriptor.tipo,
      activo: suscriptor.activo,
      createdAt: suscriptor.createdAt,
      updatedAt: suscriptor.updatedAt,
    };
  }
}
