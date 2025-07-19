import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryInterface, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { PasswordServiceInterface, PASSWORD_SERVICE_TOKEN } from '../services/password.service.interface';
import { AuthServiceInterface, AUTH_SERVICE_TOKEN, AuthTokens } from '../services/auth.service.interface';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(PASSWORD_SERVICE_TOKEN)
    private readonly passwordService: PasswordServiceInterface,
    @Inject(AUTH_SERVICE_TOKEN)
    private readonly authService: AuthServiceInterface,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await this.passwordService.compare(
      password,
      user.password.value,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.authService.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }
}