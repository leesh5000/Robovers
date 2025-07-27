import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Redis } from 'ioredis';
import { EmailVerificationTokenService } from '@/modules/auth/domain/services/email-verification-token.service';

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: Redis;
  let emailVerificationTokenService: EmailVerificationTokenService;

  beforeAll(async () => {
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
  });

  afterAll(async () => {
    // 테스트 데이터 정리
    await prisma.user.deleteMany({
      where: { email: { contains: 'test' } },
    });
    await redis.flushdb();
    await app.close();
  });

  describe('POST /api/auth/register - 이메일 인증 통합 테스트', () => {
    const testUser = {
      email: 'test.email@example.com',
      password: 'Test1234!',
      nickname: '테스트유저',
    };

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

      // Redis에 토큰이 저장되었는지 확인
      const storedToken = await redis.get(
        `email_verification:${testUser.email}`,
      );
      expect(storedToken).toBeTruthy();

      // 토큰이 유효한지 검증
      const verificationResult =
        await emailVerificationTokenService.verifyToken(storedToken!);
      expect(verificationResult).toEqual({
        isValid: true,
        email: testUser.email,
      });
    });

    it('이메일 인증 Rate Limit이 적용된다', async () => {
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

      // Then - 4번째 요청도 회원가입은 성공하지만, 이메일은 발송되지 않음
      const rateLimitCount = await redis.get(
        `rate_limit:verification:${testUser.email}`,
      );
      expect(Number(rateLimitCount)).toBe(4);

      // 토큰이 저장되지 않았는지 확인 (rate limit 초과로 이메일 미발송)
      const storedToken = await redis.get(
        `email_verification:${testUser.email}`,
      );
      expect(storedToken).toBeNull();
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

      const token = await emailVerificationTokenService.generateToken(
        user.email,
      );
      await redis.set(`email_verification:${user.email}`, token, 'EX', 3600);

      // When
      const response = await request(app.getHttpServer())
        .post('/api/auth/verify-email')
        .send({ token })
        .expect(200);

      // Then
      expect(response.body).toEqual({
        message: '이메일 인증이 완료되었습니다.',
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
    });

    it('유효하지 않은 토큰은 거부한다', async () => {
      // When
      await request(app.getHttpServer())
        .post('/api/auth/verify-email')
        .send({ token: 'invalid-token' })
        .expect(400);
    });
  });
});
