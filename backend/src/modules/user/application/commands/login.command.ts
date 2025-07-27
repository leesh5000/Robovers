import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { PasswordHashService } from '../../domain/services/password-hash.service.interface';
import { Email } from '../../domain/value-objects/email.vo';
import {
  UnauthorizedException,
  ForbiddenException,
  EmailNotVerifiedException,
} from '@/common/exceptions/app.exception';
import {
  USER_REPOSITORY_TOKEN,
  PASSWORD_HASH_SERVICE_TOKEN,
} from '../../infrastructure/di-tokens';

export interface LoginCommandInput {
  email: string;
  password: string;
}

export interface LoginCommandOutput {
  user: {
    id: string;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    role: string;
    emailVerified: boolean;
  };
}

@Injectable()
export class LoginCommand {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASH_SERVICE_TOKEN)
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async execute(input: LoginCommandInput): Promise<LoginCommandOutput> {
    // 이메일 유효성 검증
    const emailVo = new Email(input.email);

    // 사용자 조회
    const user = await this.userRepository.findByEmail(emailVo.getValue());
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await this.passwordHashService.compare(
      input.password,
      user.getPassword(),
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    // 계정 상태 확인
    if (!user.isActiveUser()) {
      throw new ForbiddenException('비활성화된 계정입니다.');
    }

    // 이메일 인증 상태 확인
    if (!user.canLogin()) {
      throw new EmailNotVerifiedException(
        '이메일 인증이 필요합니다.',
        user.getEmail(),
      );
    }

    // 마지막 로그인 시간 업데이트
    user.updateLastLogin();
    await this.userRepository.update(user);

    return {
      user: {
        id: user.getId(),
        email: user.getEmail(),
        nickname: user.getNickname(),
        profileImageUrl: user.getProfileImageUrl(),
        role: user.getRole(),
        emailVerified: user.isEmailVerified(),
      },
    };
  }
}
