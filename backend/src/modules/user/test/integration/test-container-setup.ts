import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { execSync } from 'child_process';

export class TestContainerSetup {
  private static postgresContainer: StartedPostgreSqlContainer;
  private static redisContainer: StartedRedisContainer;

  static async setupContainers() {
    // PostgreSQL 컨테이너 시작
    this.postgresContainer = await new PostgreSqlContainer('postgres:16')
      .withDatabase('robovers_test')
      .withUsername('test')
      .withPassword('test')
      .start();

    // Redis 컨테이너 시작
    this.redisContainer = await new RedisContainer('redis:7')
      .start();

    // 환경 변수 설정
    process.env.DATABASE_URL = this.postgresContainer.getConnectionUri();
    process.env.REDIS_URL = `redis://${this.redisContainer.getHost()}:${this.redisContainer.getPort()}`;

    // Prisma 마이그레이션 실행
    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });
  }

  static async teardownContainers() {
    await this.postgresContainer?.stop();
    await this.redisContainer?.stop();
  }

  static getPostgresContainer() {
    return this.postgresContainer;
  }

  static getRedisContainer() {
    return this.redisContainer;
  }
}