import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { SuscriptorRepositoryPort, SUSCRIPTOR_REPOSITORY_PORT } from '../../../domain/suscriptores/ports/suscriptor.repository.port';
import { Suscriptor } from '../../../domain/suscriptores/entities/suscriptor.entity';
import { CreateSuscriptorDto } from '../dto/create-suscriptor.dto';
import { SuscriptorResponseDto } from '../dto/suscriptor-response.dto';

@Injectable()
export class CreateSuscriptorUseCase {
  constructor(
    @Inject(SUSCRIPTOR_REPOSITORY_PORT)
    private readonly suscriptorRepository: SuscriptorRepositoryPort,
  ) {}

  async execute(dto: CreateSuscriptorDto): Promise<SuscriptorResponseDto> {
    // Verificar si ya existe un suscriptor con el mismo código
    const existingSuscriptor = await this.suscriptorRepository.findByCodigo(dto.codigo);
    if (existingSuscriptor) {
      throw new ConflictException(`Ya existe un suscriptor con el código: ${dto.codigo}`);
    }

    const suscriptor = Suscriptor.create(dto);
    const savedSuscriptor = await this.suscriptorRepository.create(suscriptor);

    return this.mapToResponseDto(savedSuscriptor);
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
