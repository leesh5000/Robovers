import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Redis } from 'ioredis';
import { EmailVerificationTokenService } from '@/modules/auth/domain/services/email-verification-token.service';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { execSync } from 'child_process';
import axios from 'axios';

// TestContainers 로그 설정
process.env.TESTCONTAINERS_LOG_LEVEL = 'INFO';

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: Redis;
  let emailVerificationTokenService: EmailVerificationTokenService;
  let postgresContainer: StartedPostgreSqlContainer;
  let redisContainer: StartedRedisContainer;
  let mailhogContainer: StartedTestContainer;

  beforeAll(async () => {
    // 1. PostgreSQL 컨테이너 시작
    console.log('Starting PostgreSQL container...');
    postgresContainer = await new PostgreSqlContainer('postgres:15')
      .withDatabase('robovers_test')
      .withUsername('test')
      .withPassword('test123')
      .start();

    // 2. Redis 컨테이너 시작
    console.log('Starting Redis container...');
    redisContainer = await new RedisContainer('redis:7-alpine').start();

    // 3. MailHog 컨테이너 시작
    console.log('Starting MailHog container...');
    mailhogContainer = await new GenericContainer('mailhog/mailhog:latest')
      .withExposedPorts(1025, 8025)
      .start();

    // 4. 환경 변수 설정
    const dbUrl = postgresContainer.getConnectionUri();
    const redisPort = redisContainer.getMappedPort(6379);
    const mailhogPort = mailhogContainer.getMappedPort(1025);
    const mailhogApiPort = mailhogContainer.getMappedPort(8025);

    console.log('Container ports:');
    console.log('Database URL:', dbUrl);
    console.log('Redis Port:', redisPort);
    console.log('MailHog SMTP Port:', mailhogPort);
    console.log('MailHog API Port:', mailhogApiPort);

    process.env.DATABASE_URL = dbUrl;
    process.env.REDIS_HOST = 'localhost';
    process.env.REDIS_PORT = redisPort.toString();
    process.env.MAILHOG_HOST = 'localhost';
    process.env.MAILHOG_PORT = mailhogPort.toString();
    process.env.JWT_SECRET = 'test-secret';
    process.env.FRONTEND_URL = 'http://localhost:3000';

    // 5. Prisma 마이그레이션 실행
    console.log('Running Prisma migrations...');
    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      stdio: 'inherit',
    });

    // 6. NestJS 앱 초기화
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');

    prisma = app.get<PrismaService>(PrismaService);
    redis = app.get<Redis>('REDIS_CLIENT');
    emailVerificationTokenService = app.get<EmailVerificationTokenService>(
      EmailVerificationTokenService,
    );

    await app.init();

    // Redis 초기화
    await redis.flushdb();
  }, 90000);

  afterAll(async () => {
    try {
      // 1. 테스트 데이터 정리
      if (prisma) {
        await prisma.user.deleteMany({
          where: { email: { contains: 'test' } },
        });
      }
      if (redis) {
        await redis.flushdb();
        await redis.quit();
      }

      // 2. 앱 종료
      if (app) {
        await app.close();
      }

      // 3. TestContainers 정리
      console.log('Stopping containers...');
      if (postgresContainer) await postgresContainer.stop();
      if (redisContainer) await redisContainer.stop();
      if (mailhogContainer) await mailhogContainer.stop();
    } catch (error) {
      console.error('Error in afterAll cleanup:', error);
    }
  }, 90000);

  describe('POST /api/auth/register - 이메일 인증 통합 테스트', () => {
    const testUser = {
      email: 'test.email@example.com',
      password: 'Test1234!',
      nickname: '테스트유저',
    };

    beforeEach(async () => {
      // 각 테스트 전에 MailHog 이메일 초기화
      try {
        const mailhogApiPort = mailhogContainer.getMappedPort(8025);
        await axios.delete(
          `http://localhost:${mailhogApiPort}/api/v1/messages`,
        );
      } catch (error) {
        // 이메일이 없어도 무시
      }
    });

    afterEach(async () => {
      // 각 테스트 후 정리
      await prisma.user.deleteMany({
        where: { email: testUser.email },
      });
      await redis.del(`email_verification:${testUser.email}`);
      await redis.del(`rate_limit:verification:${testUser.email}`);
    });

    it('회원가입 시 이메일 인증 토큰이 Redis에 저장된다', async () => {
      // Given & When
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      // Then
      expect(response.body).toEqual({
        id: expect.any(String),
        email: testUser.email,
        nickname: testUser.nickname,
      });

      // 이메일 발송이 비동기로 처리되므로 약간 대기
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redis에 토큰이 저장되었는지 확인
      const storedToken = await redis.get(
        `email_verification:${testUser.email}`,
      );
      expect(storedToken).toBeTruthy();

      // 토큰이 유효한지 검증
      const verificationResult = await emailVerificationTokenService.verifyCode(
        testUser.email,
        storedToken!,
        storedToken!,
      );
      expect(verificationResult).toEqual({
        isValid: true,
        email: testUser.email,
      });
    });

    it('회원가입 시 이메일이 MailHog로 발송된다', async () => {
      // Given & When
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      // Then - MailHog API로 이메일 확인
      // MailHog API로 이메일 확인 - 약간의 대기 시간 필요
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // MailHog API를 통해 이메일 확인
      const mailhogApiPort = mailhogContainer.getMappedPort(8025);
      const mailhogApiUrl = `http://localhost:${mailhogApiPort}/api/v2/messages`;
      console.log('Checking emails at:', mailhogApiUrl);
      const response = await axios.get(mailhogApiUrl);
      const messages = response.data.items;

      expect(messages.length).toBeGreaterThanOrEqual(1);
      expect(
        messages[0].To[0].Mailbox + '@' + messages[0].To[0].Domain,
      ).toContain(testUser.email);
      // UTF-8 인코딩된 제목 확인
      const subject = messages[0].Content.Headers.Subject[0];
      expect(subject).toMatch(/=\?UTF-8\?Q\?.*\?=/); // UTF-8 인코딩 형식 확인

      // 이메일 본문에 6자리 코드가 있는지 확인
      const emailContent = messages[0].Content.Body;
      const codeMatch = emailContent.match(/\d{6}/);
      expect(codeMatch).toBeTruthy();

      // 이메일 정리
      await axios.delete(`http://localhost:${mailhogApiPort}/api/v1/messages`);
    });

    it('이메일 인증 Rate Limit이 적용된다', async () => {
      // Rate limit 초기화
      await redis.del(`rate_limit:verification:${testUser.email}`);
      await redis.del(`email_verification:${testUser.email}`);

      // Given - 첫 3번의 요청은 성공
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            ...testUser,
            nickname: `테스트유저${i}`,
          })
          .expect(201);

        // 각 요청 후 사용자 삭제 (이메일 중복 방지)
        await prisma.user.deleteMany({
          where: { email: testUser.email },
        });
      }

      // When - 4번째 요청
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          ...testUser,
          nickname: '테스트유저4',
        })
        .expect(201);

      // 이메일 발송 대기
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Then - 4번째 요청도 회원가입은 성공하지만, 이메일은 발송되지 않음
      const rateLimitCount = await redis.get(
        `rate_limit:verification:${testUser.email}`,
      );
      expect(Number(rateLimitCount)).toBe(4);

      // 3번째 요청까지는 토큰이 저장되었지만, 4번째는 rate limit에 걸려서 갱신되지 않음
      const storedToken = await redis.get(
        `email_verification:${testUser.email}`,
      );
      // 마지막으로 성공한 3번째 요청의 토큰이 있어야 함
      expect(storedToken).toBeTruthy();
    });
  });

  describe('POST /api/auth/verify-email - 이메일 인증 검증', () => {
    it('유효한 토큰으로 이메일을 인증한다', async () => {
      // Given - 사용자 생성 및 토큰 생성
      const user = await prisma.user.create({
        data: {
          email: 'verify.test@example.com',
          password: 'hashedPassword',
          nickname: '인증테스트',
          emailVerified: false,
        },
      });

      const token =
        await emailVerificationTokenService.generateVerificationCode();
      await redis.set(`email_verification:${user.email}`, token, 'EX', 3600);

      // When
      const response = await request(app.getHttpServer())
        .post('/api/auth/verify-email')
        .send({
          email: user.email,
          code: token,
        })
        .expect(200);

      // Then
      expect(response.body).toEqual({
        message: '이메일 인증이 완료되었습니다.',
        success: true,
      });

      // DB에서 인증 상태 확인
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser?.emailVerified).toBe(true);
      expect(updatedUser?.emailVerifiedAt).toBeTruthy();

      // Redis에서 토큰이 삭제되었는지 확인
      const deletedToken = await redis.get(`email_verification:${user.email}`);
      expect(deletedToken).toBeNull();

      // 테스트 후 사용자 삭제
      await prisma.user.delete({ where: { id: user.id } });
    });

    it('유효하지 않은 토큰은 거부한다', async () => {
      // When
      await request(app.getHttpServer())
        .post('/api/auth/verify-email')
        .send({
          email: 'invalid@example.com',
          code: 'invalid-token',
        })
        .expect(400);
    });
  });
});
