import { User } from '../../domain/entities/user.entity';

export interface TokenPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthServiceInterface {
  generateTokens(user: User): Promise<AuthTokens>;
  verifyToken(token: string): Promise<TokenPayload | null>;
  revokeToken(token: string): Promise<void>;
}

export const AUTH_SERVICE_TOKEN = Symbol('AuthServiceInterface');