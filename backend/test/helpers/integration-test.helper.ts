import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TestContainersHelper } from './test-containers';
import { execSync } from 'child_process';

export class IntegrationTestHelper {
  private app: INestApplication;
  private moduleRef: TestingModule;

  async setupTestModule(imports: any[]): Promise<void> {
    // TestContainers 시작
    const containers = await TestContainersHelper.startAll();
    
    // 환경 변수 설정
    process.env.DATABASE_URL = TestContainersHelper.getPostgresConnectionUrl();
    const redisOptions = TestContainersHelper.getRedisConnectionOptions();
    process.env.REDIS_HOST = redisOptions.host;
    process.env.REDIS_PORT = redisOptions.port.toString();
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '7d';
    process.env.NODE_ENV = 'test';

    // Prisma 마이그레이션 실행
    console.log('Running Prisma migrations...');
    execSync('npx prisma migrate deploy', {
      env: { ...process.env },
      stdio: 'inherit'
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
    
    // 트랜잭션으로 모든 데이터 삭제
    await prisma.$transaction([
      prisma.comment.deleteMany(),
      prisma.post.deleteMany(),
      prisma.stockPrice.deleteMany(),
      prisma.robot.deleteMany(),
      prisma.company.deleteMany(),
      prisma.user.deleteMany(),
    ]);
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
}