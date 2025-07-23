import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { NotFoundException } from '@/common/exceptions/app.exception';
import { USER_REPOSITORY_TOKEN } from '../../infrastructure/di-tokens';

export interface GetUserProfileQueryInput {
  userId: string;
}

export interface GetUserProfileQueryOutput {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
}

@Injectable()
export class GetUserProfileQuery {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    input: GetUserProfileQueryInput,
  ): Promise<GetUserProfileQueryOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      id: user.getId(),
      email: user.getEmail(),
      nickname: user.getNickname(),
      profileImageUrl: user.getProfileImageUrl(),
      role: user.getRole(),
      isActive: user.isActiveUser(),
      emailVerified: user.isEmailVerified(),
      createdAt: user.getCreatedAt(),
      lastLoginAt: user.getLastLoginAt(),
    };
  }
}