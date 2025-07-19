import { RegisterUserUseCase } from '../../../../application/use-cases/register-user.use-case';
import { FakeUserRepository } from '../../../fakes/fake-user.repository';
import { FakePasswordService } from '../../../fakes/fake-password.service';
import { FakeUserFactory } from '../../../fakes/fake-user.factory';
import { UserAlreadyExistsException } from '../../../../domain/exceptions/user-already-exists.exception';
import { Email } from '../../../../domain/value-objects/email.vo';
import { Password } from '../../../../domain/value-objects/password.vo';
import { Nickname } from '../../../../domain/value-objects/nickname.vo';
import { User } from '../../../../domain/entities/user.entity';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: FakeUserRepository;
  let passwordService: FakePasswordService;
  let userFactory: FakeUserFactory;
  let mockSendVerificationEmailUseCase: any;

  beforeEach(() => {
    userRepository = new FakeUserRepository();
    passwordService = new FakePasswordService();
    userFactory = new FakeUserFactory();
    mockSendVerificationEmailUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    };
    useCase = new RegisterUserUseCase(
      userRepository, 
      passwordService, 
      userFactory,
      mockSendVerificationEmailUseCase
    );
  });

  afterEach(() => {
    userRepository.clear();
    userFactory.reset();
  });

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      // Given
      const email = 'test@example.com';
      const password = 'Test123!@#';
      const nickname = 'test_user';

      // When
      const user = await useCase.execute(email, password, nickname);

      // Then
      expect(user).toBeDefined();
      expect(user.email.value).toBe(email);
      expect(user.nickname.getValue).toBe(nickname);
      expect(user.password.isHashed()).toBe(true);
      expect(user.password.value).toBe('hashed_Test123!@#');
      expect(user.emailVerified).toBe(false);
      
      // Verify user was saved
      const savedUser = await userRepository.findById(user.id);
      expect(savedUser).toBeDefined();
      expect(savedUser?.id).toBe(user.id);
      
      // Verify verification email was sent
      expect(mockSendVerificationEmailUseCase.execute).toHaveBeenCalledWith(email);
    });

    it('should throw error when email already exists', async () => {
      // Given
      const email = 'test@example.com';
      await useCase.execute(email, 'Password123!', 'user1');

      // When & Then
      await expect(
        useCase.execute(email, 'Password123!', 'user2')
      ).rejects.toThrow(UserAlreadyExistsException);
    });

    it('should throw error for invalid email format', async () => {
      // When & Then
      await expect(
        useCase.execute('invalid-email', 'Password123!', 'testuser')
      ).rejects.toThrow('Invalid email format');
    });

    it('should throw error for invalid nickname format', async () => {
      // When & Then
      await expect(
        useCase.execute('test@example.com', 'Password123!', 'a')
      ).rejects.toThrow('Nickname must be at least 2 characters long');
    });

    it('should throw error for weak password', async () => {
      // When & Then
      await expect(
        useCase.execute('test@example.com', 'weak', 'testuser')
      ).rejects.toThrow('Password must be at least 8 characters long');
    });
  });
});