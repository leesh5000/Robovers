import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { Nickname } from '../../domain/value-objects/nickname.vo';
import {
  NotFoundException,
  ConflictException,
} from '@/common/exceptions/app.exception';
import { USER_REPOSITORY_TOKEN } from '../../infrastructure/di-tokens';

export interface UpdateUserProfileCommandInput {
  userId: string;
  nickname?: string;
  profileImageUrl?: string;
}

export interface UpdateUserProfileCommandOutput {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
}

@Injectable()
export class UpdateUserProfileCommand {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    input: UpdateUserProfileCommandInput,
  ): Promise<UpdateUserProfileCommandOutput> {
    // 사용자 조회
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 닉네임 변경 시 중복 확인
    if (input.nickname && input.nickname !== user.getNickname()) {
      const nicknameVo = new Nickname(input.nickname);
      const nicknameExists = await this.userRepository.existsByNickname(
        nicknameVo.getValue(),
      );
      if (nicknameExists) {
        throw new ConflictException('이미 사용 중인 닉네임입니다.');
      }
      input.nickname = nicknameVo.getValue();
    }

    // 프로필 업데이트
    user.updateProfile(input.nickname, input.profileImageUrl);

    // 저장
    const updatedUser = await this.userRepository.update(user);

    return {
      id: updatedUser.getId(),
      email: updatedUser.getEmail(),
      nickname: updatedUser.getNickname(),
      profileImageUrl: updatedUser.getProfileImageUrl(),
    };
  }
}
