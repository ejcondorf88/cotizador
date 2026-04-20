/**
 * TestContainers PostgreSQL Helper
 *
 * Proporciona una instancia de PostgreSQL en contenedor para tests de integración.
 * Usa TestContainers para levantar un contenedor PostgreSQL temporal.
 */

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';

/**
 * Helper class for managing PostgreSQL TestContainer
 */
export class TestDatabase {
  private container: StartedPostgreSqlContainer | null = null;
  private dataSource: DataSource | null = null;

  /**
   * Start PostgreSQL container and create DataSource
   * @param entities Array of TypeORM entities to synchronize
   * @returns DataSource connected to the test container
   */
  async start(entities: any[]): Promise<DataSource> {
    this.container = await new PostgreSqlContainer()
      .withDatabase('test')
      .withUsername('test')
      .withPassword('test')
      .start();

    this.dataSource = new DataSource({
      type: 'postgres',
      host: this.container.getHost(),
      port: this.container.getPort(),
      username: 'test',
      password: 'test',
      database: 'test',
      entities,
      synchronize: true,
      logging: false,
    });

    await this.dataSource.initialize();
    return this.dataSource;
  }

  /**
   * Stop container and close connection
   */
  async stop(): Promise<void> {
    if (this.dataSource) {
      await this.dataSource.destroy();
      this.dataSource = null;
    }
    if (this.container) {
      await this.container.stop();
      this.container = null;
    }
  }

  /**
   * Clean all tables (truncate)
   */
  async clean(): Promise<void> {
    if (!this.dataSource) return;

    const entities = this.dataSource.entityMetadatas;
    const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ');

    if (tableNames.length > 0) {
      await this.dataSource.query(`TRUNCATE ${tableNames} CASCADE;`);
    }
  }

  /**
   * Get container instance
   */
  getContainer(): StartedPostgreSqlContainer | null {
    return this.container;
  }

  /**
   * Get DataSource instance
   */
  getDataSource(): DataSource | null {
    return this.dataSource;
  }
}

/**
 * Singleton instance for reuse across tests in the same file
 */
export const testDatabase = new TestDatabase();
