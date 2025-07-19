import { deleteCookie, getCookie, logoutAdmin, isAdminAuthenticated } from './auth';

describe('Auth utilities', () => {
  // 각 테스트 전에 쿠키 초기화
  beforeEach(() => {
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      }
    });
  });

  describe('getCookie', () => {
    it('should return cookie value when cookie exists', () => {
      // Arrange
      document.cookie = 'test-cookie=test-value; path=/';
      
      // Act
      const result = getCookie('test-cookie');
      
      // Assert
      expect(result).toBe('test-value');
    });

    it('should return null when cookie does not exist', () => {
      // Act
      const result = getCookie('non-existent');
      
      // Assert
      expect(result).toBeNull();
    });

    it('should handle multiple cookies correctly', () => {
      // Arrange
      document.cookie = 'cookie1=value1; path=/';
      document.cookie = 'cookie2=value2; path=/';
      document.cookie = 'cookie3=value3; path=/';
      
      // Act & Assert
      expect(getCookie('cookie1')).toBe('value1');
      expect(getCookie('cookie2')).toBe('value2');
      expect(getCookie('cookie3')).toBe('value3');
    });
  });

  describe('deleteCookie', () => {
    it('should delete existing cookie', () => {
      // Arrange
      document.cookie = 'admin-token=test-token; path=/';
      expect(getCookie('admin-token')).toBe('test-token');
      
      // Act
      deleteCookie('admin-token');
      
      // Assert
      expect(getCookie('admin-token')).toBeNull();
    });

    it('should not throw error when deleting non-existent cookie', () => {
      // Act & Assert
      expect(() => deleteCookie('non-existent')).not.toThrow();
    });
  });

  describe('isAdminAuthenticated', () => {
    it('should return true when admin-token exists', () => {
      // Arrange
      document.cookie = 'admin-token=valid-token; path=/';
      
      // Act
      const result = isAdminAuthenticated();
      
      // Assert
      expect(result).toBe(true);
    });

    it('should return false when admin-token does not exist', () => {
      // Act
      const result = isAdminAuthenticated();
      
      // Assert
      expect(result).toBe(false);
    });
  });

  describe('logoutAdmin', () => {
    it('should delete admin-token cookie', () => {
      // Arrange
      document.cookie = 'admin-token=test-token; path=/';
      expect(getCookie('admin-token')).toBe('test-token');
      
      // Act
      logoutAdmin();
      
      // Assert
      expect(getCookie('admin-token')).toBeNull();
      // 테스트 환경에서는 리다이렉트가 발생하지 않음
    });

    it('should handle logout when no admin-token exists', () => {
      // Arrange
      expect(getCookie('admin-token')).toBeNull();
      
      // Act & Assert - should not throw error
      expect(() => logoutAdmin()).not.toThrow();
      expect(getCookie('admin-token')).toBeNull();
    });
  });
});