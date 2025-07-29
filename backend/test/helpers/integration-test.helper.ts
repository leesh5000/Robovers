import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TestContainersHelper } from './test-containers';
import { execSync } from 'child_process';
import Redis from 'ioredis';

export class IntegrationTestHelper {
  private app: INestApplication;
  private moduleRef: TestingModule;

  async setupTestModule(imports: any[]): Promise<void> {
    // TestContainers 시작
    await TestContainersHelper.startAll();

    // 환경 변수 설정
    process.env.DATABASE_URL = TestContainersHelper.getPostgresConnectionUrl();
    const redisOptions = TestContainersHelper.getRedisConnectionOptions();
    process.env.REDIS_HOST = redisOptions.host;
    process.env.REDIS_PORT = redisOptions.port.toString();
    
    const mailhogOptions = TestContainersHelper.getMailhogConnectionOptions();
    process.env.MAILHOG_HOST = mailhogOptions.smtpHost;
    process.env.MAILHOG_PORT = mailhogOptions.smtpPort.toString();
    
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '7d';
    process.env.NODE_ENV = 'test';

    // Redis 연결 대기
    console.log(
      `Waiting for Redis to be ready at ${redisOptions.host}:${redisOptions.port}...`,
    );
    await this.waitForRedis(redisOptions.host, redisOptions.port);

    // Prisma 스키마 푸시 (테스트용)
    console.log('Pushing Prisma schema to test database...');
    execSync('npx prisma db push --force-reset', {
      env: { ...process.env },
      stdio: 'inherit',
    });

    // NestJS 테스트 모듈 생성
    this.moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
        }),
        ...imports,
      ],
    }).compile();

    this.app = this.moduleRef.createNestApplication();
    this.app.setGlobalPrefix('api');
    await this.app.init();
  }

  async teardown(): Promise<void> {
    // 앱 종료
    if (this.app) {
      await this.app.close();
    }

    // 컨테이너 종료
    await TestContainersHelper.stopAll();
  }

  getApp(): INestApplication {
    return this.app;
  }

  getModule(): TestingModule {
    return this.moduleRef;
  }

  async clearDatabase(): Promise<void> {
    const prisma = this.app.get(PrismaService);

    try {
      // 외래키 순서에 맞춰 삭제 (자식 -> 부모 순서)
      await prisma.like.deleteMany();
      await prisma.comment.deleteMany();
      await prisma.post.deleteMany();
      await prisma.refreshToken.deleteMany();
      await prisma.stockPrice.deleteMany();
      await prisma.robot.deleteMany();
      await prisma.company.deleteMany();
      await prisma.user.deleteMany();
    } catch (error) {
      console.warn('Database clear warning:', error.message);
      // 테이블이 존재하지 않는 경우 무시
    }
  }

  async createTestUser(data: {
    email: string;
    password: string;
    nickname: string;
    emailVerified?: boolean;
  }) {
    const prisma = this.app.get(PrismaService);

    return await prisma.user.create({
      data: {
        ...data,
        emailVerifiedAt: data.emailVerified ? new Date() : null,
      },
    });
  }

  getRedisClient() {
    return this.app.get('REDIS_CLIENT');
  }

  private async waitForRedis(
    host: string,
    port: number,
    maxRetries = 60,
  ): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const redis = new Redis({
          host,
          port,
          lazyConnect: true,
          retryStrategy: () => null, // 재시도 비활성화
        });

        await redis.connect();
        await redis.ping();
        await redis.disconnect();
        console.log('Redis is ready!');
        return;
      } catch (error) {
        console.log(`Redis not ready yet, attempt ${i + 1}/${maxRetries}...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    throw new Error('Redis failed to start within timeout');
  }
}
