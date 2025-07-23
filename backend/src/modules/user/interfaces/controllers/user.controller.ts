import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { GetUserProfileQuery } from '../../application/queries/get-user-profile.query';
import { UpdateUserProfileCommand } from '../../application/commands/update-user-profile.command';
import { UserProfileDto } from '../dtos/user-profile.dto';
import {
  UpdateProfileDto,
  UpdateProfileResponseDto,
} from '../dtos/update-profile.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly getUserProfileQuery: GetUserProfileQuery,
    private readonly updateUserProfileCommand: UpdateUserProfileCommand,
  ) {}

  @Get('me')
  @ApiOperation({ summary: '내 프로필 조회' })
  @ApiResponse({
    status: 200,
    description: '프로필 조회 성공',
    type: UserProfileDto,
  })
  async getMyProfile(@CurrentUser() userId: string): Promise<UserProfileDto> {
    return this.getUserProfileQuery.execute({ userId });
  }

  @Put('me')
  @ApiOperation({ summary: '내 프로필 수정' })
  @ApiResponse({
    status: 200,
    description: '프로필 수정 성공',
    type: UpdateProfileResponseDto,
  })
  @ApiResponse({ status: 409, description: '닉네임 중복' })
  async updateMyProfile(
    @CurrentUser() userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UpdateProfileResponseDto> {
    return this.updateUserProfileCommand.execute({
      userId,
      ...dto,
    });
  }
}