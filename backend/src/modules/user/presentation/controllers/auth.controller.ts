import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { VerifyEmailUseCase } from '../../application/use-cases/verify-email.use-case';
import { SendVerificationEmailUseCase } from '../../application/use-cases/send-verification-email.use-case';
import { RegisterUserDto } from '../dtos/request/register-user.dto';
import { LoginUserDto } from '../dtos/request/login-user.dto';
import { VerifyEmailDto } from '../dtos/request/verify-email.dto';
import { ResendVerificationDto } from '../dtos/request/resend-verification.dto';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { AuthResponseDto } from '../dtos/response/auth-response.dto';
import { Public } from '../decorators/public.decorator';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly sendVerificationEmailUseCase: SendVerificationEmailUseCase,
  ) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully. Verification email sent.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Registration successful. Please check your email for verification.' },
        email: { type: 'string', example: 'user@example.com' }
      }
    }
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() dto: RegisterUserDto): Promise<{ message: string; email: string }> {
    const user = await this.registerUserUseCase.execute(
      dto.email,
      dto.password,
      dto.nickname,
    );
    return { 
      message: 'Registration successful. Please check your email for verification.',
      email: user.email.value
    };
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginUserDto): Promise<AuthResponseDto> {
    const result = await this.loginUserUseCase.execute(
      dto.email,
      dto.password,
    );
    return new AuthResponseDto(result);
  }

  @Post('verify-email')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with code' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification code' })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<{ message: string }> {
    await this.verifyEmailUseCase.execute(dto.email, dto.code);
    return { message: 'Email verified successfully' };
  }

  @Post('resend-verification')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  @ApiResponse({ status: 400, description: 'Too many requests or invalid email' })
  async resendVerification(@Body() dto: ResendVerificationDto): Promise<{ message: string }> {
    await this.sendVerificationEmailUseCase.execute(dto.email);
    return { message: 'Verification email sent' };
  }
}