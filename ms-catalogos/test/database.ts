import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { StartedTestContainer } from 'testcontainers';

export class TestDatabase {
  private container: StartedTestContainer | null = null;

  async start(): Promise<{
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }> {
    this.container = await new PostgreSqlContainer()
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
