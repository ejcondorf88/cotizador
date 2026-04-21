import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OficinaRepositoryPort, OFICINA_REPOSITORY_PORT } from '../../../domain/oficinas/ports/oficina.repository.port';

@Injectable()
export class DeleteOficinaUseCase {
  constructor(
    @Inject(OFICINA_REPOSITORY_PORT)
    private readonly oficinaRepository: OficinaRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const oficina = await this.oficinaRepository.findById(id);
    if (!oficina) {
      throw new NotFoundException(`Oficina con ID ${id} no encontrada`);
    }

    await this.oficinaRepository.delete(id);
  }
}
