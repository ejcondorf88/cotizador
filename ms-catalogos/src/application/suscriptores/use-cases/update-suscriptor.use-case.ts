import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { SuscriptorRepositoryPort, SUSCRIPTOR_REPOSITORY_PORT } from '../../../domain/suscriptores/ports/suscriptor.repository.port';
import { Suscriptor } from '../../../domain/suscriptores/entities/suscriptor.entity';
import { UpdateSuscriptorDto } from '../dto/update-suscriptor.dto';
import { SuscriptorResponseDto } from '../dto/suscriptor-response.dto';

@Injectable()
export class UpdateSuscriptorUseCase {
  constructor(
    @Inject(SUSCRIPTOR_REPOSITORY_PORT)
    private readonly suscriptorRepository: SuscriptorRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateSuscriptorDto): Promise<SuscriptorResponseDto> {
    const suscriptor = await this.suscriptorRepository.findById(id);
    if (!suscriptor) {
      throw new NotFoundException(`Suscriptor con ID ${id} no encontrado`);
    }

    // Verificar código único si se está actualizando
    if (dto.codigo && dto.codigo !== suscriptor.codigo) {
      const existingSuscriptor = await this.suscriptorRepository.findByCodigo(dto.codigo);
      if (existingSuscriptor) {
        throw new ConflictException(`Ya existe un suscriptor con el código: ${dto.codigo}`);
      }
    }

    suscriptor.update(dto);
    const updatedSuscriptor = await this.suscriptorRepository.update(id, suscriptor);

    return this.mapToResponseDto(updatedSuscriptor);
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
