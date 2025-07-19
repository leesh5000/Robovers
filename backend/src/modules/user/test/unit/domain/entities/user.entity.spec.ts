import { User, UserRole } from '../../../../domain/entities/user.entity';
import { Email } from '../../../../domain/value-objects/email.vo';
import { Password } from '../../../../domain/value-objects/password.vo';
import { Nickname } from '../../../../domain/value-objects/nickname.vo';

describe('User Entity', () => {
  const createValidUser = () => {
    return User.create({
      id: '123',
      email: Email.create('test@example.com'),
      password: Password.create('Test123!@#'),
      nickname: Nickname.create('test_user'),
    });
  };

  describe('create', () => {
    it('should create a user with required fields', () => {
      const user = User.create({
        id: '456',
        email: Email.create('test@example.com'),
        password: Password.create('Test123!@#'),
        nickname: Nickname.create('test_user'),
      });

      expect(user.id).toBe('456');
      expect(user.email.value).toBe('test@example.com');
      expect(user.password.value).toBe('Test123!@#');
      expect(user.nickname.getValue).toBe('test_user');
      expect(user.role).toBe(UserRole.USER);
      expect(user.isActive).toBe(true);
      expect(user.emailVerified).toBe(false);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create a user with optional fields', () => {
      const user = User.create({
        id: '789',
        email: Email.create('test@example.com'),
        password: Password.create('Test123!@#'),
        nickname: Nickname.create('test_user'),
        bio: 'Test bio',
        profileImageUrl: 'https://example.com/avatar.jpg',
      });

      expect(user.nickname.getValue).toBe('test_user');
      expect(user.bio).toBe('Test bio');
      expect(user.profileImageUrl).toBe('https://example.com/avatar.jpg');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile information', () => {
      const user = createValidUser();

      user.updateProfile({
        nickname: Nickname.create('new_nickname'),
        bio: 'Updated bio',
        profileImageUrl: 'https://example.com/new-avatar.jpg',
      });

      expect(user.nickname.getValue).toBe('new_nickname');
      expect(user.bio).toBe('Updated bio');
      expect(user.profileImageUrl).toBe('https://example.com/new-avatar.jpg');
      expect(user.updatedAt).toBeDefined();
    });

    it('should allow partial updates', () => {
      const user = createValidUser();
      const originalNickname = user.nickname.getValue;
      
      user.updateProfile({
        bio: 'Updated bio only',
      });

      expect(user.nickname.getValue).toBe(originalNickname); // unchanged
      expect(user.bio).toBe('Updated bio only');
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

  describe('getDisplayName', () => {
    it('should return nickname as display name', () => {
      const user = createValidUser();
      expect(user.getDisplayName()).toBe('test_user');
    });

    it('should return different nickname when updated', () => {
      const user = createValidUser();
      user.updateProfile({
        nickname: Nickname.create('updated_nick'),
      });
      
      expect(user.getDisplayName()).toBe('updated_nick');
    });
  });
});