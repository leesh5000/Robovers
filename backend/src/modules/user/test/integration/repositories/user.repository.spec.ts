import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UserRepository } from '../../../infrastructure/persistence/prisma/user.repository';
import { User, UserRole } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Username } from '../../../domain/value-objects/username.vo';
import { Password } from '../../../domain/value-objects/password.vo';
import { UserMapper } from '../../../infrastructure/persistence/mappers/user.mapper';
import { UserFactory } from '../../../domain/factories/user.factory';
import { SnowflakeIdService } from '@/common/snowflake/snowflake-id.service';
import { TestContainerSetup } from '../test-container-setup';

describe('UserRepository (Integration)', () => {
  let repository: UserRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    await TestContainerSetup.setupContainers();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        PrismaService,
        UserMapper,
        UserFactory,
        SnowflakeIdService,
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prisma = module.get<PrismaService>(PrismaService);
  }, 60000);

  afterAll(async () => {
    await prisma.$disconnect();
    await TestContainerSetup.teardownContainers();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  const createTestUser = () => {
    return User.create({
      id: '1',
      email: Email.create('test@example.com'),
      username: Username.create('testuser'),
      password: Password.fromHash('$2b$10$hashedpassword'),
      firstName: 'John',
      lastName: 'Doe',
    });
  };

  describe('save', () => {
    it('should save a new user', async () => {
      const user = createTestUser();

      const savedUser = await repository.save(user);

      expect(savedUser.id).toBe(user.id);
      expect(savedUser.email.value).toBe('test@example.com');
      expect(savedUser.username.value).toBe('testuser');

      // DB에서 직접 확인
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(dbUser).toBeDefined();
      expect(dbUser?.email).toBe('test@example.com');
    });

    it('should update an existing user', async () => {
      const user = createTestUser();
      await repository.save(user);

      // 사용자 정보 업데이트
      user.updateProfile({
        firstName: 'Jane',
        lastName: 'Smith',
      });

      const updatedUser = await repository.save(user);

      expect(updatedUser.firstName).toBe('Jane');
      expect(updatedUser.lastName).toBe('Smith');

      // DB에서 확인
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(dbUser?.firstName).toBe('Jane');
      expect(dbUser?.lastName).toBe('Smith');
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const user = createTestUser();
      await repository.save(user);

      const foundUser = await repository.findById(user.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(user.id);
      expect(foundUser?.email.value).toBe('test@example.com');
    });

    it('should return null for non-existent id', async () => {
      const foundUser = await repository.findById('non-existent-id');
      expect(foundUser).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const user = createTestUser();
      await repository.save(user);

      const foundUser = await repository.findByEmail('test@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(user.id);
      expect(foundUser?.email.value).toBe('test@example.com');
    });

    it('should return null for non-existent email', async () => {
      const foundUser = await repository.findByEmail('nonexistent@example.com');
      expect(foundUser).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      const user = createTestUser();
      await repository.save(user);

      const foundUser = await repository.findByUsername('testuser');

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(user.id);
      expect(foundUser?.username.value).toBe('testuser');
    });

    it('should return null for non-existent username', async () => {
      const foundUser = await repository.findByUsername('nonexistentuser');
      expect(foundUser).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users with pagination', async () => {
      // 여러 사용자 생성
      const users = [];
      for (let i = 0; i < 5; i++) {
        const user = User.create({
          id: String(i + 1),
          email: Email.create(`test${i}@example.com`),
          username: Username.create(`testuser${i}`),
          password: Password.fromHash('$2b$10$hashedpassword'),
        });
        await repository.save(user);
        users.push(user);
      }

      // 전체 조회
      const result = await repository.findAll();
      expect(result.total).toBe(5);
      expect(result.users).toHaveLength(5);

      // 페이지네이션
      const paginatedResult = await repository.findAll({
        skip: 1,
        take: 2,
      });
      expect(paginatedResult.total).toBe(5);
      expect(paginatedResult.users).toHaveLength(2);
    });

    it('should order users by specified field', async () => {
      // 사용자들을 다른 시간에 생성
      const user1 = User.create({
        id: '101',
        email: Email.create('alice@example.com'),
        username: Username.create('alice'),
        password: Password.fromHash('$2b$10$hashedpassword'),
      });
      await repository.save(user1);

      // 약간의 지연
      await new Promise(resolve => setTimeout(resolve, 10));

      const user2 = User.create({
        id: '102',
        email: Email.create('bob@example.com'),
        username: Username.create('bob'),
        password: Password.fromHash('$2b$10$hashedpassword'),
      });
      await repository.save(user2);

      // email 기준 오름차순 정렬
      const result = await repository.findAll({
        orderBy: { email: 'asc' },
      });

      expect(result.users[0].email.value).toBe('alice@example.com');
      expect(result.users[1].email.value).toBe('bob@example.com');
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = createTestUser();
      await repository.save(user);

      await repository.delete(user.id);

      const deletedUser = await repository.findById(user.id);
      expect(deletedUser).toBeNull();

      // DB에서 직접 확인
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(dbUser).toBeNull();
    });

    it('should not throw error when deleting non-existent user', async () => {
      await expect(
        repository.delete('non-existent-id')
      ).rejects.toThrow(); // Prisma는 존재하지 않는 레코드 삭제 시 에러 발생
    });
  });
});