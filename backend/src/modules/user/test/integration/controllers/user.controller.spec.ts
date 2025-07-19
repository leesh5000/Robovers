import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TestContainerSetup } from '../test-container-setup';

describe('UserController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    // TestContainers 설정
    await TestContainerSetup.setupContainers();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // 실제 환경과 동일한 설정
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
    // 데이터베이스 초기화
    await prisma.user.deleteMany();

    // 테스트 사용자 생성 및 로그인
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test123!@#',
        firstName: 'John',
        lastName: 'Doe',
      });

    userId = registerResponse.body.id;

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test123!@#',
      });

    accessToken = loginResponse.body.accessToken;
  });

  describe('GET /api/users/me', () => {
    it('should return current user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: userId,
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
        isActive: true,
        emailVerified: false,
      });
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/users/me')
        .expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update user profile successfully', async () => {
      const updateDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        bio: 'Software engineer passionate about robotics',
        profileImageUrl: 'https://example.com/avatar.jpg',
      };

      const response = await request(app.getHttpServer())
        .put('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: userId,
        email: 'test@example.com',
        username: 'testuser',
        ...updateDto,
      });

      // DB에서 실제로 업데이트되었는지 확인
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      expect(updatedUser?.firstName).toBe('Jane');
      expect(updatedUser?.lastName).toBe('Smith');
      expect(updatedUser?.bio).toBe(updateDto.bio);
    });

    it('should allow partial updates', async () => {
      const response = await request(app.getHttpServer())
        .put('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          bio: 'Updated bio only',
        })
        .expect(200);

      expect(response.body.bio).toBe('Updated bio only');
      expect(response.body.firstName).toBe('John'); // 변경되지 않음
      expect(response.body.lastName).toBe('Doe');   // 변경되지 않음
    });

    it('should return 400 for invalid URL format', async () => {
      const response = await request(app.getHttpServer())
        .put('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          profileImageUrl: 'not-a-valid-url',
        })
        .expect(400);

      expect(response.body.message).toContain('profileImageUrl');
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .put('/api/users/me')
        .send({
          firstName: 'Jane',
        })
        .expect(401);
    });

    it('should reject forbidden fields', async () => {
      const response = await request(app.getHttpServer())
        .put('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          firstName: 'Jane',
          email: 'newemail@example.com', // 금지된 필드
        })
        .expect(400);

      expect(response.body.message).toContain('should not exist');
    });
  });
});