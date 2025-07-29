import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { RegisterUserCommand } from '../../application/commands/register-user.command';
import { LoginCommand } from '../../application/commands/login.command';
import { VerifyEmailCommand } from '../../application/commands/verify-email.command';
import { ResendVerificationCommand } from '../../application/commands/resend-verification.command';
import {
  RegisterUserDto,
  RegisterUserResponseDto,
} from '../dtos/register-user.dto';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import {
  VerifyEmailDto,
  VerifyEmailResponseDto,
} from '../dtos/verify-email.dto';
import { TOKEN_SERVICE_TOKEN } from '../../infrastructure/di-tokens';
import { TokenService } from '../../application/services/token.service.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserCommand: RegisterUserCommand,
    private readonly loginCommand: LoginCommand,
    private readonly verifyEmailCommand: VerifyEmailCommand,
    private readonly resendVerificationCommand: ResendVerificationCommand,
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: TokenService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: RegisterUserResponseDto,
  })
  @ApiResponse({ status: 409, description: '이메일 또는 닉네임 중복' })
  async register(
    @Body() dto: RegisterUserDto,
  ): Promise<RegisterUserResponseDto> {
    return this.registerUserCommand.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패 또는 이메일 인증 필요' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.loginCommand.execute(dto);

    // 토큰 생성
    const tokenPayload = {
      sub: result.user.id,
      email: result.user.email,
      role: result.user.role,
    };
    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    // 쿠키 설정
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15분
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return {
      user: {
        ...result.user,
        isActive: true, // 로그인 성공했으므로 항상 true
      },
      accessToken,
      refreshToken,
    };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '이메일 인증' })
  @ApiResponse({
    status: 200,
    description: '이메일 인증 성공',
    type: VerifyEmailResponseDto,
  })
  @ApiResponse({ status: 400, description: '유효하지 않은 토큰' })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ): Promise<VerifyEmailResponseDto> {
    return this.verifyEmailCommand.execute(dto);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '인증 이메일 재발송' })
  @ApiResponse({
    status: 200,
    description: '인증 이메일 재발송 성공',
  })
  async resendVerification(
    @Body() dto: { email: string },
  ): Promise<{ message: string }> {
    return this.resendVerificationCommand.execute(dto);
  }
}
