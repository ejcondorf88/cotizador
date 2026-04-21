import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SuscriptorRepositoryPort, SUSCRIPTOR_REPOSITORY_PORT } from '../../../domain/suscriptores/ports/suscriptor.repository.port';
import { Suscriptor } from '../../../domain/suscriptores/entities/suscriptor.entity';
import { SuscriptorResponseDto } from '../dto/suscriptor-response.dto';

@Injectable()
export class GetSuscriptorByIdUseCase {
  constructor(
    @Inject(SUSCRIPTOR_REPOSITORY_PORT)
    private readonly suscriptorRepository: SuscriptorRepositoryPort,
  ) {}

  async execute(id: string): Promise<SuscriptorResponseDto> {
    const suscriptor = await this.suscriptorRepository.findById(id);
    if (!suscriptor) {
      throw new NotFoundException(`Suscriptor con ID ${id} no encontrado`);
    }

    return this.mapToResponseDto(suscriptor);
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
