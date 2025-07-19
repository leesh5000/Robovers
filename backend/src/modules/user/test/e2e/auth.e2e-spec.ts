import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TestContainerSetup } from '../integration/test-container-setup';

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    await TestContainerSetup.setupContainers();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.setGlobalPrefix('api');
    
    prisma = app.get(PrismaService);
    
    await app.init();
  }, 60000);

  afterAll(async () => {
    await app.close();
    await TestContainerSetup.teardownContainers();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('User Registration and Authentication Flow', () => {
    it('should complete full user registration and login flow', async () => {
      const userInfo = {
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'SecurePass123!',
        firstName: 'New',
        lastName: 'User',
      };

      // 1. 회원가입
      const registerResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userInfo)
        .expect(201);

      expect(registerResponse.body).toMatchObject({
        email: userInfo.email,
        username: userInfo.username,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        role: 'USER',
        isActive: true,
        emailVerified: false,
      });

      const userId = registerResponse.body.id;

      // 2. 로그인
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: userInfo.email,
          password: userInfo.password,
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('accessToken');
      expect(loginResponse.body).toHaveProperty('refreshToken');
      expect(loginResponse.body.user.id).toBe(userId);

      const { accessToken } = loginResponse.body;

      // 3. 프로필 조회
      const profileResponse = await request(app.getHttpServer())
        .get('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(profileResponse.body.id).toBe(userId);
      expect(profileResponse.body.email).toBe(userInfo.email);

      // 4. 프로필 업데이트
      const updateResponse = await request(app.getHttpServer())
        .put('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          bio: 'I love robotics!',
          profileImageUrl: 'https://example.com/my-avatar.jpg',
        })
        .expect(200);

      expect(updateResponse.body.bio).toBe('I love robotics!');
      expect(updateResponse.body.profileImageUrl).toBe('https://example.com/my-avatar.jpg');

      // 5. 업데이트된 프로필 확인
      const updatedProfileResponse = await request(app.getHttpServer())
        .get('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(updatedProfileResponse.body.bio).toBe('I love robotics!');
    });

    it('should handle duplicate registration attempts correctly', async () => {
      const userInfo = {
        email: 'duplicate@example.com',
        username: 'duplicateuser',
        password: 'Test123!@#',
      };

      // 첫 번째 등록 성공
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userInfo)
        .expect(201);

      // 동일한 이메일로 재등록 시도 - 실패
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          ...userInfo,
          username: 'differentusername',
        })
        .expect(409);

      // 동일한 사용자명으로 재등록 시도 - 실패
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          ...userInfo,
          email: 'different@example.com',
        })
        .expect(409);
    });

    it('should handle invalid authentication attempts', async () => {
      // 존재하지 않는 사용자로 로그인 시도
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401);

      // 사용자 생성
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'CorrectPass123!',
        })
        .expect(201);

      // 잘못된 비밀번호로 로그인 시도
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPass123!',
        })
        .expect(401);
    });

    it('should protect authenticated endpoints', async () => {
      // 인증 없이 보호된 엔드포인트 접근 시도
      await request(app.getHttpServer())
        .get('/api/users/me')
        .expect(401);

      await request(app.getHttpServer())
        .put('/api/users/me')
        .send({ bio: 'New bio' })
        .expect(401);

      // 잘못된 토큰으로 접근 시도
      await request(app.getHttpServer())
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});