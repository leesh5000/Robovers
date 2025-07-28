import { UserEntity } from './user.entity';
import { UserRole } from '../value-objects/user-role.vo';

describe('UserEntity', () => {
  describe('create', () => {
    it('새로운 사용자 엔티티를 생성해야 함', () => {
      const user = UserEntity.create({
        email: 'test@example.com',
        password: 'hashedPassword123',
        nickname: '테스트유저',
      });

      expect(user.getEmail()).toBe('test@example.com');
      expect(user.getPassword()).toBe('hashedPassword123');
      expect(user.getNickname()).toBe('테스트유저');
      expect(user.getRole()).toBe(UserRole.USER);
      expect(user.isActiveUser()).toBe(true);
      expect(user.isEmailVerified()).toBe(false);
    });

    it('프로필 이미지와 역할을 지정하여 생성할 수 있어야 함', () => {
      const user = UserEntity.create({
        email: 'admin@example.com',
        password: 'hashedPassword123',
        nickname: '관리자',
        profileImageUrl: 'https://example.com/profile.jpg',
        role: UserRole.ADMIN,
      });

      expect(user.getProfileImageUrl()).toBe('https://example.com/profile.jpg');
      expect(user.getRole()).toBe(UserRole.ADMIN);
      expect(user.isAdmin()).toBe(true);
    });
  });

  describe('verifyEmail', () => {
    it('이메일 인증을 처리해야 함', () => {
      const user = UserEntity.create({
        email: 'test@example.com',
        password: 'hashedPassword123',
        nickname: '테스트유저',
      });

      expect(user.isEmailVerified()).toBe(false);
      expect(user.getEmailVerifiedAt()).toBeNull();

      user.verifyEmail();

      expect(user.isEmailVerified()).toBe(true);
      expect(user.getEmailVerifiedAt()).toBeInstanceOf(Date);
    });

    it('이미 인증된 이메일에 대해 에러를 발생시켜야 함', () => {
      const user = UserEntity.create({
        email: 'test@example.com',
        password: 'hashedPassword123',
        nickname: '테스트유저',
      });

      user.verifyEmail();

      expect(() => user.verifyEmail()).toThrow(
        '이미 이메일 인증이 완료되었습니다.',
      );
    });
  });

  describe('updateProfile', () => {
    it('닉네임을 업데이트해야 함', () => {
      const user = UserEntity.create({
        email: 'test@example.com',
        password: 'hashedPassword123',
        nickname: '기존닉네임',
      });

      user.updateProfile('새닉네임');

      expect(user.getNickname()).toBe('새닉네임');
    });

    it('프로필 이미지를 업데이트해야 함', () => {
      const user = UserEntity.create({
        email: 'test@example.com',
        password: 'hashedPassword123',
        nickname: '테스트유저',
      });

      user.updateProfile(undefined, 'https://example.com/new-profile.jpg');

      expect(user.getProfileImageUrl()).toBe(
        'https://example.com/new-profile.jpg',
      );
    });
  });

  describe('canLogin', () => {
    it('활성화되고 이메일 인증된 사용자는 로그인 가능해야 함', () => {
      const user = UserEntity.create({
        email: 'test@example.com',
        password: 'hashedPassword123',
        nickname: '테스트유저',
      });

      user.verifyEmail();

      expect(user.canLogin()).toBe(true);
    });

    it('이메일 인증되지 않은 사용자는 로그인 불가해야 함', () => {
      const user = UserEntity.create({
        email: 'test@example.com',
        password: 'hashedPassword123',
        nickname: '테스트유저',
      });

      expect(user.canLogin()).toBe(false);
    });

    it('비활성화된 사용자는 로그인 불가해야 함', () => {
      const user = UserEntity.create({
        email: 'test@example.com',
        password: 'hashedPassword123',
        nickname: '테스트유저',
      });

      user.verifyEmail();
      user.deactivate();

      expect(user.canLogin()).toBe(false);
    });
  });
});
