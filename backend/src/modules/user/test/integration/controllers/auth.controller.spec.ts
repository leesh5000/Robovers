import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TestContainerSetup } from '../test-container-setup';

describe('AuthController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
  }, 60000); // TestContainers 시작 시간을 고려한 타임아웃

  afterAll(async () => {
    await app.close();
    await TestContainerSetup.teardownContainers();
  });

  beforeEach(async () => {
    // 데이터베이스 초기화
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test123!@#',
        firstName: 'John',
        lastName: 'Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        email: registerDto.email,
        username: registerDto.username,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: 'USER',
        isActive: true,
        emailVerified: false,
      });

      // DB에 실제로 저장되었는지 확인
      const savedUser = await prisma.user.findUnique({
        where: { email: registerDto.email },
      });
      expect(savedUser).toBeDefined();
      expect(savedUser?.username).toBe(registerDto.username);
    });

    it('should return 409 when email already exists', async () => {
      const registerDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test123!@#',
      };

      // 첫 번째 등록
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(201);

      // 동일한 이메일로 두 번째 등록 시도
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          ...registerDto,
          username: 'differentuser',
        })
        .expect(409);

      expect(response.body.message).toContain('email');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          username: 'testuser',
          password: 'Test123!@#',
        })
        .expect(400);

      expect(response.body.message).toContain('Invalid email format');
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'weak',
        })
        .expect(400);

      expect(response.body.message).toContain('Password');
    });
  });

  describe('POST /api/auth/login', () => {
    const createTestUser = async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'Test123!@#',
        });
    };

    it('should login successfully with valid credentials', async () => {
      await createTestUser();

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        user: {
          email: 'test@example.com',
          username: 'testuser',
        },
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });

      // JWT 토큰 형식 확인
      expect(response.body.accessToken).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
      expect(response.body.refreshToken).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    });

    it('should return 401 for invalid password', async () => {
      await createTestUser();

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!@#',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should normalize email to lowercase', async () => {
      await createTestUser();

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'TEST@EXAMPLE.COM',
          password: 'Test123!@#',
        })
        .expect(200);

      expect(response.body.user.email).toBe('test@example.com');
    });
  });
});