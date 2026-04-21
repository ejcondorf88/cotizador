import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

export class TestDatabase {
  private container: StartedPostgreSqlContainer | null = null;

  async start(): Promise<{
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }> {
    this.container = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('test_catalogos')
      .withUsername('test')
      .withPassword('test')
      .start();

    return {
      host: this.container.getHost(),
      port: this.container.getPort(),
      username: 'test',
      password: 'test',
      database: 'test_catalogos',
    };
  }

  async stop(): Promise<void> {
    if (this.container) {
      await this.container.stop();
    }
  }
}

export const testDatabase = new TestDatabase();
