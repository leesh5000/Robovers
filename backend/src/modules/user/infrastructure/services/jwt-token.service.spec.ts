import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from './jwt-token.service';
import { UnauthorizedException } from '@/common/exceptions/app.exception';

describe('JwtTokenService', () => {
  let service: JwtTokenService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  describe('JWT_SECRET validation', () => {
    it('should throw error when JWT_SECRET is not defined', () => {
      mockConfigService.get.mockReturnValue(undefined);

      expect(() => {
        new JwtTokenService(mockJwtService as any, mockConfigService as any);
      }).toThrow('JWT_SECRET must be defined in environment variables');
    });

    it('should throw error when JWT_SECRET is empty string', () => {
      mockConfigService.get.mockReturnValue('');

      expect(() => {
        new JwtTokenService(mockJwtService as any, mockConfigService as any);
      }).toThrow('JWT_SECRET must be defined in environment variables');
    });

    it('should throw error when JWT_SECRET contains only spaces', () => {
      mockConfigService.get.mockReturnValue('   ');

      expect(() => {
        new JwtTokenService(mockJwtService as any, mockConfigService as any);
      }).toThrow('JWT_SECRET must be defined in environment variables');
    });
  });

  describe('JwtTokenService functionality', () => {
    beforeEach(async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        const config: any = {
          JWT_SECRET: 'test-secret-key',
          JWT_ACCESS_TOKEN_EXPIRATION: '15m',
          JWT_REFRESH_TOKEN_EXPIRATION: '7d',
        };
        return config[key];
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          JwtTokenService,
          {
            provide: JwtService,
            useValue: mockJwtService,
          },
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      }).compile();

      service = module.get<JwtTokenService>(JwtTokenService);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('generateAccessToken', () => {
      it('should generate access token with correct parameters', () => {
        const payload = {
          sub: 'userId',
          email: 'test@example.com',
          role: 'USER',
        };
        const expectedToken = 'access-token';
        mockJwtService.sign.mockReturnValue(expectedToken);

        const result = service.generateAccessToken(payload);

        expect(result).toBe(expectedToken);
        expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
          secret: 'test-secret-key',
          expiresIn: '15m',
        });
      });
    });

    describe('generateRefreshToken', () => {
      it('should generate refresh token with correct parameters', () => {
        const payload = {
          sub: 'userId',
          email: 'test@example.com',
          role: 'USER',
        };
        const expectedToken = 'refresh-token';
        mockJwtService.sign.mockReturnValue(expectedToken);

        const result = service.generateRefreshToken(payload);

        expect(result).toBe(expectedToken);
        expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
          secret: 'test-secret-key',
          expiresIn: '7d',
        });
      });
    });

    describe('verifyAccessToken', () => {
      it('should verify and return payload when token is valid', () => {
        const token = 'valid-token';
        const expectedPayload = {
          sub: 'userId',
          email: 'test@example.com',
          role: 'USER',
        };
        mockJwtService.verify.mockReturnValue(expectedPayload);

        const result = service.verifyAccessToken(token);

        expect(result).toBe(expectedPayload);
        expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
          secret: 'test-secret-key',
        });
      });

      it('should throw UnauthorizedException when token is invalid', () => {
        const token = 'invalid-token';
        mockJwtService.verify.mockImplementation(() => {
          throw new Error('Invalid token');
        });

        expect(() => service.verifyAccessToken(token)).toThrow(
          new UnauthorizedException('유효하지 않은 액세스 토큰입니다.'),
        );
      });
    });

    describe('verifyRefreshToken', () => {
      it('should verify and return payload when token is valid', () => {
        const token = 'valid-refresh-token';
        const expectedPayload = {
          sub: 'userId',
          email: 'test@example.com',
          role: 'USER',
        };
        mockJwtService.verify.mockReturnValue(expectedPayload);

        const result = service.verifyRefreshToken(token);

        expect(result).toBe(expectedPayload);
        expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
          secret: 'test-secret-key',
        });
      });

      it('should throw UnauthorizedException when token is invalid', () => {
        const token = 'invalid-token';
        mockJwtService.verify.mockImplementation(() => {
          throw new Error('Invalid token');
        });

        expect(() => service.verifyRefreshToken(token)).toThrow(
          new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.'),
        );
      });
    });
  });
});
