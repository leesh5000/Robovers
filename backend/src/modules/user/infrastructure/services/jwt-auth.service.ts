import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { User } from '../../domain/entities/user.entity';
import { 
  AuthServiceInterface, 
  TokenPayload, 
  AuthTokens 
} from '../../application/services/auth.service.interface';
import authConfig from '../config/auth.config';

@Injectable()
export class JwtAuthService implements AuthServiceInterface {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async generateTokens(user: User): Promise<AuthTokens> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email.value,
      username: user.username.value,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.config.jwt.accessTokenExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.config.jwt.refreshTokenExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token);
      return payload;
    } catch {
      return null;
    }
  }

  async revokeToken(token: string): Promise<void> {
    // In a production environment, you would typically:
    // 1. Store the token in a blacklist (Redis)
    // 2. Check the blacklist on every request
    // For now, this is a no-op
  }
}