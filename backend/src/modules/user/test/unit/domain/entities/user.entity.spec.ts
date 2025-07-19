import { User, UserRole } from '../../../../domain/entities/user.entity';
import { Email } from '../../../../domain/value-objects/email.vo';
import { Username } from '../../../../domain/value-objects/username.vo';
import { Password } from '../../../../domain/value-objects/password.vo';

describe('User Entity', () => {
  const createValidUser = () => {
    return User.create({
      email: Email.create('test@example.com'),
      username: Username.create('testuser'),
      password: Password.create('Test123!@#'),
      firstName: 'John',
      lastName: 'Doe',
    });
  };

  describe('create', () => {
    it('should create a user with required fields', () => {
      const user = User.create({
        email: Email.create('test@example.com'),
        username: Username.create('testuser'),
        password: Password.create('Test123!@#'),
      });

      expect(user.email.value).toBe('test@example.com');
      expect(user.username.value).toBe('testuser');
      expect(user.password.value).toBe('Test123!@#');
      expect(user.role).toBe(UserRole.USER);
      expect(user.isActive).toBe(true);
      expect(user.emailVerified).toBe(false);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create a user with optional fields', () => {
      const user = User.create({
        email: Email.create('test@example.com'),
        username: Username.create('testuser'),
        password: Password.create('Test123!@#'),
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test bio',
        profileImageUrl: 'https://example.com/avatar.jpg',
      });

      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.bio).toBe('Test bio');
      expect(user.profileImageUrl).toBe('https://example.com/avatar.jpg');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile information', () => {
      const user = createValidUser();

      user.updateProfile({
        firstName: 'Jane',
        lastName: 'Smith',
        bio: 'Updated bio',
        profileImageUrl: 'https://example.com/new-avatar.jpg',
      });

      expect(user.firstName).toBe('Jane');
      expect(user.lastName).toBe('Smith');
      expect(user.bio).toBe('Updated bio');
      expect(user.profileImageUrl).toBe('https://example.com/new-avatar.jpg');
      expect(user.updatedAt).toBeDefined();
    });

    it('should allow partial updates', () => {
      const user = createValidUser();
      
      user.updateProfile({
        firstName: 'Jane',
      });

      expect(user.firstName).toBe('Jane');
      expect(user.lastName).toBe('Doe'); // unchanged
    });
  });

  describe('changePassword', () => {
    it('should change user password', () => {
      const user = createValidUser();
      const newPassword = Password.create('NewPass123!@#');

      user.changePassword(newPassword);

      expect(user.password.value).toBe('NewPass123!@#');
    });
  });

  describe('verifyEmail', () => {
    it('should mark email as verified', () => {
      const user = createValidUser();
      
      expect(user.emailVerified).toBe(false);
      user.verifyEmail();
      expect(user.emailVerified).toBe(true);
    });
  });

  describe('deactivate', () => {
    it('should deactivate user', () => {
      const user = createValidUser();
      
      expect(user.isActive).toBe(true);
      user.deactivate();
      expect(user.isActive).toBe(false);
    });
  });

  describe('activate', () => {
    it('should activate user', () => {
      const user = createValidUser();
      user.deactivate();
      
      expect(user.isActive).toBe(false);
      user.activate();
      expect(user.isActive).toBe(true);
    });
  });

  describe('changeRole', () => {
    it('should change user role', () => {
      const user = createValidUser();
      
      expect(user.role).toBe(UserRole.USER);
      user.changeRole(UserRole.MODERATOR);
      expect(user.role).toBe(UserRole.MODERATOR);
    });
  });

  describe('getFullName', () => {
    it('should return full name when both first and last name exist', () => {
      const user = createValidUser();
      expect(user.getFullName()).toBe('John Doe');
    });

    it('should return only first name when last name is missing', () => {
      const user = User.create({
        email: Email.create('test@example.com'),
        username: Username.create('testuser'),
        password: Password.create('Test123!@#'),
        firstName: 'John',
      });
      
      expect(user.getFullName()).toBe('John');
    });

    it('should return only last name when first name is missing', () => {
      const user = User.create({
        email: Email.create('test@example.com'),
        username: Username.create('testuser'),
        password: Password.create('Test123!@#'),
        lastName: 'Doe',
      });
      
      expect(user.getFullName()).toBe('Doe');
    });

    it('should return empty string when both names are missing', () => {
      const user = User.create({
        email: Email.create('test@example.com'),
        username: Username.create('testuser'),
        password: Password.create('Test123!@#'),
      });
      
      expect(user.getFullName()).toBe('');
    });
  });
});