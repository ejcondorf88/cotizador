import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  @Get()
  async check() {
    try {
      // Verificar conexión a base de datos
      await this.dataSource.query('SELECT 1');
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'up',
          api: 'up',
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'down',
          api: 'up',
        },
        error: error instanceof Error ? error.message : 'Database connection failed',
      };
    }
  }

  @Get('ready')
  async readiness() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'ready' };
    } catch {
      return { status: 'not ready' };
    }
  }

  @Get('live')
  liveness() {
    return { status: 'alive' };
  }
}
