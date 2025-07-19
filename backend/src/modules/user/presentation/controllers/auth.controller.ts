import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RegisterUserDto } from '../dtos/request/register-user.dto';
import { LoginUserDto } from '../dtos/request/login-user.dto';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { AuthResponseDto } from '../dtos/response/auth-response.dto';
import { Public } from '../decorators/public.decorator';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  async register(@Body() dto: RegisterUserDto): Promise<UserResponseDto> {
    const user = await this.registerUserUseCase.execute(
      dto.email,
      dto.username,
      dto.password,
      dto.firstName,
      dto.lastName,
    );
    return new UserResponseDto(user);
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
}