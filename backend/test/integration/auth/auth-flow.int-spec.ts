import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { IntegrationTestHelper } from '../../helpers/integration-test.helper';
import { AppModule } from '@/app.module';
import { EmailVerificationTokenService } from '@/modules/auth/domain/services/email-verification-token.service';
import { Redis } from 'ioredis';

describe.skip('Auth Flow Integration Tests (Skipped - TestContainers not installed)', () => {
  let testHelper: IntegrationTestHelper;
  let app: INestApplication;
  let emailVerificationService: EmailVerificationTokenService;
  let redis: Redis;

  beforeAll(async () => {
    testHelper = new IntegrationTestHelper();
    await testHelper.setupTestModule([AppModule]);
    
    app = testHelper.getApp();
    emailVerificationService = app.get(EmailVerificationTokenService);
    redis = testHelper.getRedisClient();
  }, 30000);

  afterAll(async () => {
    await testHelper.teardown();
  });

  beforeEach(async () => {
    await testHelper.clearDatabase();
    await redis.flushdb();
  });

  describe('회원가입 → 이메일 인증 → 로그인 플로우', () => {
    const testUser = {
      email: 'integration@test.com',
      password: 'Test1234!',
      nickname: '통합테스트',
    };

    it('전체 인증 플로우가 정상적으로 동작한다', async () => {
      // 1. 회원가입
      const signupResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(signupResponse.body).toMatchObject({
        id: expect.any(String),
        email: testUser.email,
        nickname: testUser.nickname,
      });

      // 2. Redis에 인증 토큰이 저장되었는지 확인
      const storedToken = await redis.get(`email_verification:${testUser.email}`);
      expect(storedToken).toBeTruthy();
      expect(storedToken).toMatch(/^\d{6}$/); // 6자리 숫자

      // 3. 이메일 인증 전 로그인 시도 (실패해야 함)
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(401);

      // 4. 이메일 인증
      await request(app.getHttpServer())
        .post('/api/auth/verify-email')
        .send({ token: storedToken })
        .expect(200);

      // 5. Redis에서 토큰이 삭제되었는지 확인
      const deletedToken = await redis.get(`email_verification:${testUser.email}`);
      expect(deletedToken).toBeNull();

      // 6. 이메일 인증 후 로그인 (성공해야 함)
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(loginResponse.body).toMatchObject({
        access_token: expect.any(String),
        user: {
          id: expect.any(String),
          email: testUser.email,
          nickname: testUser.nickname,
        },
      });
    });

    it('Rate limiting이 정상적으로 동작한다', async () => {
      // 첫 번째 회원가입
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      // 데이터베이스 정리 (중복 방지)
      await testHelper.clearDatabase();

      // 같은 이메일로 연속 요청 (Rate limit: 3회/시간)
      for (let i = 0; i < 2; i++) {
        await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({ ...testUser, nickname: `테스트${i}` })
          .expect(201);
        
        await testHelper.clearDatabase();
      }

      // 4번째 요청 - 회원가입은 성공하지만 이메일은 발송되지 않음
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...testUser, nickname: '테스트4' })
        .expect(201);

      // Rate limit 카운트 확인
      const rateLimitCount = await redis.get(`rate_limit:verification:${testUser.email}`);
      expect(Number(rateLimitCount)).toBe(4);

      // 토큰이 저장되지 않았는지 확인 (rate limit 초과)
      const token = await redis.get(`email_verification:${testUser.email}`);
      expect(token).toBeNull();
    });

    it('잘못된 인증 토큰으로는 인증할 수 없다', async () => {
      // 회원가입
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      // 잘못된 토큰으로 인증 시도
      await request(app.getHttpServer())
        .post('/api/auth/verify-email')
        .send({ token: '999999' })
        .expect(400);

      // 실제 토큰 확인 (여전히 존재해야 함)
      const storedToken = await redis.get(`email_verification:${testUser.email}`);
      expect(storedToken).toBeTruthy();
    });

    it('중복된 이메일로는 가입할 수 없다', async () => {
      // 첫 번째 가입
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      // 같은 이메일로 재가입 시도
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...testUser, nickname: '다른닉네임' })
        .expect(409);
    });
  });

  describe('트랜잭션 롤백 테스트', () => {
    it('이메일 발송 실패 시 회원가입이 롤백된다', async () => {
      // EmailService를 일시적으로 오류 발생하도록 mock
      const emailService = app.get('EmailService');
      const originalSend = emailService.sendVerificationEmail;
      emailService.sendVerificationEmail = jest.fn().mockRejectedValue(new Error('Email service error'));

      // 회원가입 시도
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'rollback@test.com',
          password: 'Test1234!',
          nickname: '롤백테스트',
        })
        .expect(500);

      // 사용자가 생성되지 않았는지 확인
      const user = await testHelper.getModule()
        .get('PrismaService')
        .user.findUnique({
          where: { email: 'rollback@test.com' },
        });
      
      expect(user).toBeNull();

      // mock 복원
      emailService.sendVerificationEmail = originalSend;
    });
  });
});