import { User } from '../../domain/entities/user.entity';

export interface TokenPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
}

export class FakeAuthService {
  private tokens: Map<string, TokenPayload> = new Map();

  async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email.value,
      username: user.username.value,
      role: user.role,
    };

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const accessToken = `access_${user.id}_${timestamp}_${random}`;
    const refreshToken = `refresh_${user.id}_${timestamp + 1}_${random}`;

    this.tokens.set(accessToken, payload);
    this.tokens.set(refreshToken, payload);

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    return this.tokens.get(token) || null;
  }

  async revokeToken(token: string): Promise<void> {
    this.tokens.delete(token);
  }

  // Test helper methods
  clear(): void {
    this.tokens.clear();
  }
}