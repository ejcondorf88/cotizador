import { Module } from '@nestjs/common';
import { GirosModule } from './giros/giros.module';
import { AgentesModule } from './agentes/agentes.module';
import { SuscriptoresModule } from './suscriptores/suscriptores.module';
import { OficinasModule } from './oficinas/oficinas.module';

@Module({
  imports: [
    GirosModule,
    AgentesModule,
    SuscriptoresModule,
    OficinasModule,
  ],
})
export class CatalogModule {}
