import { 
  Controller, 
  Get, 
  Put, 
  Body, 
  UseGuards,
  Inject,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { UserRepositoryInterface, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { Nickname } from '../../domain/value-objects/nickname.vo';

@ApiTags('Users')
@Controller('api/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile', type: UserResponseDto })
  async getProfile(@CurrentUser('sub') userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    return new UserResponseDto(user);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated', type: UserResponseDto })
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    user.updateProfile({
      nickname: dto.nickname ? Nickname.create(dto.nickname) : undefined,
      bio: dto.bio,
      profileImageUrl: dto.profileImageUrl,
    });

    const updatedUser = await this.userRepository.update(user);
    return new UserResponseDto(updatedUser);
  }
}