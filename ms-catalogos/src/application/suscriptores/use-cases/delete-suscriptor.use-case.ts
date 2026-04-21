import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SuscriptorRepositoryPort, SUSCRIPTOR_REPOSITORY_PORT } from '../../../domain/suscriptores/ports/suscriptor.repository.port';

@Injectable()
export class DeleteSuscriptorUseCase {
  constructor(
    @Inject(SUSCRIPTOR_REPOSITORY_PORT)
    private readonly suscriptorRepository: SuscriptorRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const suscriptor = await this.suscriptorRepository.findById(id);
    if (!suscriptor) {
      throw new NotFoundException(`Suscriptor con ID ${id} no encontrado`);
    }

    await this.suscriptorRepository.delete(id);
  }
}
