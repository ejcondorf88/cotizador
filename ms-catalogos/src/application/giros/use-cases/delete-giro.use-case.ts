import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GiroRepositoryPort, GIRO_REPOSITORY_PORT } from '../../../domain/giros/ports/giro.repository.port';

@Injectable()
export class DeleteGiroUseCase {
  constructor(
    @Inject(GIRO_REPOSITORY_PORT)
    private readonly giroRepository: GiroRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const giro = await this.giroRepository.findById(id);
    if (!giro) {
      throw new NotFoundException(`Giro con ID ${id} no encontrado`);
    }

    await this.giroRepository.delete(id);
  }
}
