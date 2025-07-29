import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import {
  GenericContainer,
  StartedTestContainer,
} from 'testcontainers';

export class TestContainersHelper {
  private static postgresContainer: StartedPostgreSqlContainer;
  private static redisContainer: StartedRedisContainer;
  private static mailhogContainer: StartedTestContainer;

  static async startPostgres(): Promise<StartedPostgreSqlContainer> {
    console.log('Starting PostgreSQL container...');

    this.postgresContainer = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('robovers_test')
      .withUsername('test_user')
      .withPassword('test_password')
      .withExposedPorts(5432)
      .start();

    console.log(
      'PostgreSQL container started on port:',
      this.postgresContainer.getMappedPort(5432),
    );

    return this.postgresContainer;
  }

  static async startRedis(): Promise<StartedRedisContainer> {
    console.log('Starting Redis container...');

    this.redisContainer = await new RedisContainer('redis:7-alpine')
      .withExposedPorts(6379)
      .start();

    console.log(
      'Redis container started on port:',
      this.redisContainer.getMappedPort(6379),
    );

    return this.redisContainer;
  }

  static async startMailhog(): Promise<StartedTestContainer> {
    console.log('Starting MailHog container...');

    this.mailhogContainer = await new GenericContainer('mailhog/mailhog:latest')
      .withExposedPorts(1025, 8025)
      .start();

    console.log(
      'MailHog container started on SMTP port:',
      this.mailhogContainer.getMappedPort(1025),
      'HTTP port:',
      this.mailhogContainer.getMappedPort(8025),
    );

    return this.mailhogContainer;
  }

  static async startAll(): Promise<{
    postgres: StartedPostgreSqlContainer;
    redis: StartedRedisContainer;
    mailhog: StartedTestContainer;
  }> {
    const [postgres, redis, mailhog] = await Promise.all([
      this.startPostgres(),
      this.startRedis(),
      this.startMailhog(),
    ]);

    return { postgres, redis, mailhog };
  }

  static async stopAll(): Promise<void> {
    console.log('Stopping containers...');

    const promises: Promise<any>[] = [];

    if (this.postgresContainer) {
      promises.push(this.postgresContainer.stop());
    }

    if (this.redisContainer) {
      promises.push(this.redisContainer.stop());
    }

    if (this.mailhogContainer) {
      promises.push(this.mailhogContainer.stop());
    }

    await Promise.all(promises);
    console.log('All containers stopped');
  }

  static getPostgresConnectionUrl(): string {
    if (!this.postgresContainer) {
      throw new Error('PostgreSQL container is not started');
    }

    const host = this.postgresContainer.getHost();
    const port = this.postgresContainer.getMappedPort(5432);
    const database = this.postgresContainer.getDatabase();
    const username = this.postgresContainer.getUsername();
    const password = this.postgresContainer.getPassword();

    return `postgresql://${username}:${password}@${host}:${port}/${database}`;
  }

  static getRedisConnectionOptions() {
    if (!this.redisContainer) {
      throw new Error('Redis container is not started');
    }

    return {
      host: this.redisContainer.getHost(),
      port: this.redisContainer.getMappedPort(6379),
    };
  }

  static getMailhogConnectionOptions() {
    if (!this.mailhogContainer) {
      throw new Error('MailHog container is not started');
    }

    return {
      smtpHost: this.mailhogContainer.getHost(),
      smtpPort: this.mailhogContainer.getMappedPort(1025),
      httpHost: this.mailhogContainer.getHost(),
      httpPort: this.mailhogContainer.getMappedPort(8025),
    };
  }
}
