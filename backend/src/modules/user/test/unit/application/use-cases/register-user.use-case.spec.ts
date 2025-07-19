import { RegisterUserUseCase } from '../../../../application/use-cases/register-user.use-case';
import { FakeUserRepository } from '../../../fakes/fake-user.repository';
import { FakePasswordService } from '../../../fakes/fake-password.service';
import { UserAlreadyExistsException } from '../../../../domain/exceptions/user-already-exists.exception';
import { Email } from '../../../../domain/value-objects/email.vo';
import { Username } from '../../../../domain/value-objects/username.vo';
import { Password } from '../../../../domain/value-objects/password.vo';
import { User } from '../../../../domain/entities/user.entity';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: FakeUserRepository;
  let passwordService: FakePasswordService;

  beforeEach(() => {
    userRepository = new FakeUserRepository();
    passwordService = new FakePasswordService();
    useCase = new RegisterUserUseCase(userRepository, passwordService);
  });

  afterEach(() => {
    userRepository.clear();
  });

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      // Given
      const email = 'test@example.com';
      const username = 'testuser';
      const password = 'Test123!@#';
      const firstName = 'John';
      const lastName = 'Doe';

      // When
      const user = await useCase.execute(email, username, password, firstName, lastName);

      // Then
      expect(user).toBeDefined();
      expect(user.email.value).toBe(email);
      expect(user.username.value).toBe(username);
      expect(user.firstName).toBe(firstName);
      expect(user.lastName).toBe(lastName);
      expect(user.password.isHashed()).toBe(true);
      expect(user.password.value).toBe('hashed_Test123!@#');
      
      // Verify user was saved
      const savedUser = await userRepository.findById(user.id);
      expect(savedUser).toBeDefined();
      expect(savedUser?.id).toBe(user.id);
    });

    it('should register user without optional fields', async () => {
      // Given
      const email = 'test@example.com';
      const username = 'testuser';
      const password = 'Test123!@#';

      // When
      const user = await useCase.execute(email, username, password);

      // Then
      expect(user).toBeDefined();
      expect(user.email.value).toBe(email);
      expect(user.username.value).toBe(username);
      expect(user.firstName).toBeUndefined();
      expect(user.lastName).toBeUndefined();
    });

    it('should throw error when email already exists', async () => {
      // Given
      const email = 'test@example.com';
      await useCase.execute(email, 'user1', 'Password123!');

      // When & Then
      await expect(
        useCase.execute(email, 'user2', 'Password123!')
      ).rejects.toThrow(UserAlreadyExistsException);
    });

    it('should throw error when username already exists', async () => {
      // Given
      const username = 'testuser';
      await useCase.execute('test1@example.com', username, 'Password123!');

      // When & Then
      await expect(
        useCase.execute('test2@example.com', username, 'Password123!')
      ).rejects.toThrow(UserAlreadyExistsException);
    });

    it('should throw error for invalid email format', async () => {
      // When & Then
      await expect(
        useCase.execute('invalid-email', 'testuser', 'Password123!')
      ).rejects.toThrow('Invalid email format');
    });

    it('should throw error for invalid username format', async () => {
      // When & Then
      await expect(
        useCase.execute('test@example.com', 'u', 'Password123!')
      ).rejects.toThrow('Username must be between 3 and 20 characters');
    });

    it('should throw error for weak password', async () => {
      // When & Then
      await expect(
        useCase.execute('test@example.com', 'testuser', 'weak')
      ).rejects.toThrow('Password must be at least 8 characters long');
    });
  });
});