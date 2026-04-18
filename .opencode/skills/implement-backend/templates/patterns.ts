/**
 * patterns.ts — Patrones de referencia para Arquitectura Hexagonal + PostgreSQL/Prisma
 * Este archivo NO se ejecuta directamente. Es una referencia para que el agente
 * genere código consistente con la arquitectura del proyecto.
 */

// ═════════════════════════════════════════════════════════════════════════════
// DOMAIN LAYER (Capa pura, sin dependencias externas)
// ═════════════════════════════════════════════════════════════════════════════

// ─── VALUE OBJECTS ────────────────────────────────────────────────────────────
export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string,
  ) {
    if (amount < 0) throw new Error('Amount cannot be negative');
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }
}

// ─── DOMAIN ENTITY (Pura TypeScript) ─────────────────────────────────────────
export interface CreateFeatureProps {
  name: string;
  description?: string;
}

export class Feature {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  // Factory method
  static create(props: CreateFeatureProps, id: string = uuid()): Feature {
    const now = new Date();
    return new Feature(
      id,
      props.name,
      props.description ?? null,
      now,
      now,
    );
  }

  // Domain logic
  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this.name = newName;
    this.updatedAt = new Date();
  }

  updateDescription(newDescription: string | null): void {
    this.description = newDescription;
    this.updatedAt = new Date();
  }
}

// ─── DOMAIN PORT (Interface) ─────────────────────────────────────────────────
// El dominio define el contrato que la infraestructura debe implementar
export interface FeatureRepositoryPort {
  create(feature: Feature): Promise<Feature>;
  findById(id: string): Promise<Feature | null>;
  findAll(options?: { limit?: number; offset?: number }): Promise<Feature[]>;
  update(id: string, feature: Feature): Promise<Feature>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

// ═════════════════════════════════════════════════════════════════════════════
// APPLICATION LAYER (Casos de uso, orquestación)
// ═════════════════════════════════════════════════════════════════════════════

import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

// ─── DTOs (Data Transfer Objects) ──────────────────────────────────────────────
export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateFeatureDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;
}

// ─── USE CASE (Depende del puerto, no de la implementación) ────────────────────
import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class CreateFeatureUseCase {
  constructor(
    @Inject('FeatureRepositoryPort')
    private readonly featureRepo: FeatureRepositoryPort,
  ) {}

  async execute(dto: CreateFeatureDto): Promise<Feature> {
    // Domain logic: crear entidad
    const feature = Feature.create({
      name: dto.name,
      description: dto.description,
    });

    // Persistir a través del puerto
    return this.featureRepo.create(feature);
  }
}

@Injectable()
export class GetFeatureUseCase {
  constructor(
    @Inject('FeatureRepositoryPort')
    private readonly featureRepo: FeatureRepositoryPort,
  ) {}

  async execute(id: string): Promise<Feature> {
    const feature = await this.featureRepo.findById(id);
    if (!feature) {
      throw new NotFoundException(`Feature with id ${id} not found`);
    }
    return feature;
  }
}

@Injectable()
export class UpdateFeatureUseCase {
  constructor(
    @Inject('FeatureRepositoryPort')
    private readonly featureRepo: FeatureRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateFeatureDto): Promise<Feature> {
    const existing = await this.featureRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Feature with id ${id} not found`);
    }

    if (dto.name !== undefined) {
      existing.updateName(dto.name);
    }

    if (dto.description !== undefined) {
      existing.updateDescription(dto.description);
    }

    return this.featureRepo.update(id, existing);
  }
}

@Injectable()
export class DeleteFeatureUseCase {
  constructor(
    @Inject('FeatureRepositoryPort')
    private readonly featureRepo: FeatureRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.featureRepo.exists(id);
    if (!exists) {
      throw new NotFoundException(`Feature with id ${id} not found`);
    }
    await this.featureRepo.delete(id);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// INFRASTRUCTURE LAYER (Prisma, PostgreSQL, Adaptadores)
// ═════════════════════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Feature as PrismaFeature } from '@prisma/client';

// ─── MAPPER (Obligatorio: convierte entre Prisma y Dominio) ──────────────────
export class FeatureMapper {
  static toDomain(prismaEntity: PrismaFeature): Feature {
    return new Feature(
      prismaEntity.id,
      prismaEntity.name,
      prismaEntity.description,
      prismaEntity.createdAt,
      prismaEntity.updatedAt,
    );
  }

  static toPrismaCreate(entity: Feature): Prisma.FeatureCreateInput {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toPrismaUpdate(entity: Feature): Prisma.FeatureUpdateInput {
    return {
      name: entity.name,
      description: entity.description,
      updatedAt: entity.updatedAt,
    };
  }
}

// ─── ADAPTER (Implementa el puerto usando Prisma) ───────────────────────────
@Injectable()
export class FeatureRepositoryAdapter implements FeatureRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(feature: Feature): Promise<Feature> {
    const prismaData = FeatureMapper.toPrismaCreate(feature);
    const created = await this.prisma.feature.create({
      data: prismaData,
    });
    return FeatureMapper.toDomain(created);
  }

  async findById(id: string): Promise<Feature | null> {
    const found = await this.prisma.feature.findUnique({
      where: { id },
    });
    return found ? FeatureMapper.toDomain(found) : null;
  }

  async findAll(options?: { limit?: number; offset?: number }): Promise<Feature[]> {
    const results = await this.prisma.feature.findMany({
      take: options?.limit,
      skip: options?.offset,
    });
    return results.map(FeatureMapper.toDomain);
  }

  async update(id: string, feature: Feature): Promise<Feature> {
    const prismaData = FeatureMapper.toPrismaUpdate(feature);
    const updated = await this.prisma.feature.update({
      where: { id },
      data: prismaData,
    });
    return FeatureMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.feature.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.feature.count({
      where: { id },
    });
    return count > 0;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// PRESENTATION LAYER (HTTP Controllers, NestJS)
// ═════════════════════════════════════════════════════════════════════════════

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';

// ─── CONTROLLER (Depende de use cases, no del repositorio) ───────────────────
@Controller('api/v1/features')
export class FeatureController {
  constructor(
    private readonly createUseCase: CreateFeatureUseCase,
    private readonly getUseCase: GetFeatureUseCase,
    private readonly updateUseCase: UpdateFeatureUseCase,
    private readonly deleteUseCase: DeleteFeatureUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFeatureDto) {
    const feature = await this.createUseCase.execute(dto);
    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const feature = await this.getUseCase.execute(id);
    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    };
  }

  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    // Listar todas las features
    return { message: 'List features' };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFeatureDto,
  ) {
    const feature = await this.updateUseCase.execute(id, dto);
    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      updatedAt: feature.updatedAt,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.deleteUseCase.execute(id);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// MODULE (Wiring de dependencias en NestJS)
// ═════════════════════════════════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FeatureController],
  providers: [
    // Use cases
    CreateFeatureUseCase,
    GetFeatureUseCase,
    UpdateFeatureUseCase,
    DeleteFeatureUseCase,
    
    // Port injection: el puerto se implementa con el adapter
    {
      provide: 'FeatureRepositoryPort',
      useClass: FeatureRepositoryAdapter,
    },
  ],
  exports: [CreateFeatureUseCase, GetFeatureUseCase, UpdateFeatureUseCase, DeleteFeatureUseCase],
})
export class FeatureModule {}

// ═════════════════════════════════════════════════════════════════════════════
// PRISMA SCHEMA (PostgreSQL)
// ═════════════════════════════════════════════════════════════════════════════
/*
// infrastructure/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Feature {
  id          String   @id @default(uuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("features")
  @@index([name])
}
*/

// ═════════════════════════════════════════════════════════════════════════════
// DATABASE MODULE
// ═════════════════════════════════════════════════════════════════════════════

import { Global, Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}

// ═════════════════════════════════════════════════════════════════════════════
// UTILS
// ═════════════════════════════════════════════════════════════════════════════

function uuid(): string {
  return crypto.randomUUID();
}

import crypto from 'crypto';

// Exportar todo desde index.ts de cada capa
// domain/feature/index.ts
// export * from './entities/feature.entity';
// export * from './ports/feature.repository.port';

// application/feature/index.ts
// export * from './dto/create-feature.dto';
// export * from './dto/update-feature.dto';
// export * from './use-cases/create-feature.use-case';
// etc.
