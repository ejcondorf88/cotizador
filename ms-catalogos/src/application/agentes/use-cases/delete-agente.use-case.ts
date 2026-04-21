import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AgenteRepositoryPort, AGENTE_REPOSITORY_PORT } from '../../../domain/agentes/ports/agente.repository.port';

@Injectable()
export class DeleteAgenteUseCase {
  constructor(
    @Inject(AGENTE_REPOSITORY_PORT)
    private readonly agenteRepository: AgenteRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const agente = await this.agenteRepository.findById(id);
    if (!agente) {
      throw new NotFoundException(`Agente con ID ${id} no encontrado`);
    }

    await this.agenteRepository.delete(id);
  }
}
