import { LoginUserUseCase } from '../../../../application/use-cases/login-user.use-case';
import { FakeUserRepository } from '../../../fakes/fake-user.repository';
import { FakePasswordService } from '../../../fakes/fake-password.service';
import { FakeAuthService } from '../../../fakes/fake-auth.service';
import { User } from '../../../../domain/entities/user.entity';
import { Email } from '../../../../domain/value-objects/email.vo';
import { Password } from '../../../../domain/value-objects/password.vo';
import { Nickname } from '../../../../domain/value-objects/nickname.vo';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let userRepository: FakeUserRepository;
  let passwordService: FakePasswordService;
  let authService: FakeAuthService;

  const createTestUser = async () => {
    const user = User.create({
      id: '1',
      email: Email.create('test@example.com'),
      password: Password.fromHash('hashed_Test123!@#'),
      nickname: Nickname.create('test_user'),
      emailVerified: true,
    });
    await userRepository.save(user);
    return user;
  };

  beforeEach(() => {
    userRepository = new FakeUserRepository();
    passwordService = new FakePasswordService();
    authService = new FakeAuthService();
    useCase = new LoginUserUseCase(userRepository, passwordService, authService);
  });

  afterEach(() => {
    userRepository.clear();
    authService.clear();
  });

  describe('execute', () => {
    it('should login user successfully with email', async () => {
      // Given
      const user = await createTestUser();
      const email = 'test@example.com';
      const password = 'Test123!@#';

      // When
      const result = await useCase.execute(email, password);

      // Then
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe(user.id);
      expect(result.user.email.value).toBe(email);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.accessToken).toContain('access_');
      expect(result.refreshToken).toContain('refresh_');
    });

    it('should throw error when user not found', async () => {
      // When & Then
      await expect(
        useCase.execute('nonexistent@example.com', 'Password123!')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error when password is incorrect', async () => {
      // Given
      await createTestUser();

      // When & Then
      await expect(
        useCase.execute('test@example.com', 'WrongPassword123!')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error when user is inactive', async () => {
      // Given
      const user = await createTestUser();
      user.deactivate();
      await userRepository.save(user);

      // When & Then
      await expect(
        useCase.execute('test@example.com', 'Test123!@#')
      ).rejects.toThrow('Account is deactivated');
    });

    it('should normalize email to lowercase', async () => {
      // Given
      await createTestUser();

      // When
      const result = await useCase.execute('TEST@EXAMPLE.COM', 'Test123!@#');

      // Then
      expect(result.user.email.value).toBe('test@example.com');
    });

    it('should generate unique tokens for each login', async () => {
      // Given
      await createTestUser();

      // When
      const result1 = await useCase.execute('test@example.com', 'Test123!@#');
      const result2 = await useCase.execute('test@example.com', 'Test123!@#');

      // Then
      expect(result1.accessToken).not.toBe(result2.accessToken);
      expect(result1.refreshToken).not.toBe(result2.refreshToken);
    });
  });
});