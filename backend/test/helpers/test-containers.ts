// TestContainers imports - uncomment when packages are properly installed
// import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
// import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';

// Mock types for when TestContainers is not available
interface StartedPostgreSqlContainer {
  getMappedPort(port: number): number;
  getHost(): string;
  getDatabase(): string;
  getUsername(): string;
  getPassword(): string;
  stop(): Promise<void>;
}

interface StartedRedisContainer {
  getMappedPort(port: number): number;
  getHost(): string;
  stop(): Promise<void>;
}

export class TestContainersHelper {
  private static postgresContainer: StartedPostgreSqlContainer;
  private static redisContainer: StartedRedisContainer;

  static async startPostgres(): Promise<StartedPostgreSqlContainer> {
    console.log('Mock: Starting PostgreSQL container...');
    
    // Mock implementation - replace with real TestContainers when installed
    this.postgresContainer = {
      getMappedPort: () => 5432,
      getHost: () => 'localhost',
      getDatabase: () => 'robovers_test',
      getUsername: () => 'test_user',
      getPassword: () => 'test_password',
      stop: async () => console.log('Mock: PostgreSQL container stopped')
    };

    console.log('Mock: PostgreSQL container started on port:', this.postgresContainer.getMappedPort(5432));
    
    return this.postgresContainer;
  }

  static async startRedis(): Promise<StartedRedisContainer> {
    console.log('Mock: Starting Redis container...');
    
    // Mock implementation - replace with real TestContainers when installed
    this.redisContainer = {
      getMappedPort: () => 6379,
      getHost: () => 'localhost',
      stop: async () => console.log('Mock: Redis container stopped')
    };

    console.log('Mock: Redis container started on port:', this.redisContainer.getMappedPort(6379));
    
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