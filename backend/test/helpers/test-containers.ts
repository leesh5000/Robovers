import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';

export class TestContainersHelper {
  private static postgresContainer: StartedPostgreSqlContainer;
  private static redisContainer: StartedRedisContainer;

  static async startPostgres(): Promise<StartedPostgreSqlContainer> {
    console.log('Starting PostgreSQL container...');
    
    this.postgresContainer = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('robovers_test')
      .withUsername('test_user')
      .withPassword('test_password')
      .withExposedPorts(5432)
      .start();

    console.log('PostgreSQL container started on port:', this.postgresContainer.getMappedPort(5432));
    
    return this.postgresContainer;
  }

  static async startRedis(): Promise<StartedRedisContainer> {
    console.log('Starting Redis container...');
    
    this.redisContainer = await new RedisContainer('redis:7-alpine')
      .withExposedPorts(6379)
      .start();

    console.log('Redis container started on port:', this.redisContainer.getMappedPort(6379));
    
    return this.redisContainer;
  }

  static async startAll(): Promise<{
    postgres: StartedPostgreSqlContainer;
    redis: StartedRedisContainer;
  }> {
    const [postgres, redis] = await Promise.all([
      this.startPostgres(),
      this.startRedis(),
    ]);

    return { postgres, redis };
  }

  static async stopAll(): Promise<void> {
    console.log('Stopping containers...');
    
    const promises: Promise<void>[] = [];
    
    if (this.postgresContainer) {
      promises.push(this.postgresContainer.stop());
    }
    
    if (this.redisContainer) {
      promises.push(this.redisContainer.stop());
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
}