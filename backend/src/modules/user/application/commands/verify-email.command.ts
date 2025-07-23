import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { EmailService } from '../../domain/services/email.service.interface';
import {
  NotFoundException,
  ValidationException,
} from '@/common/exceptions/app.exception';
import {
  USER_REPOSITORY_TOKEN,
  EMAIL_SERVICE_TOKEN,
} from '../../infrastructure/di-tokens';

export interface VerifyEmailCommandInput {
  email: string;
  verificationToken: string;
}

export interface VerifyEmailCommandOutput {
  success: boolean;
  message: string;
}

@Injectable()
export class VerifyEmailCommand {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(EMAIL_SERVICE_TOKEN)
    private readonly emailService: EmailService,
  ) {}

  async execute(
    input: VerifyEmailCommandInput,
  ): Promise<VerifyEmailCommandOutput> {
    // TODO: 실제 토큰 검증 로직 구현
    // 임시로 토큰이 'temp-verification-token'인 경우만 성공
    if (input.verificationToken !== 'temp-verification-token') {
      throw new ValidationException('유효하지 않은 인증 토큰입니다.');
    }

    // 사용자 조회
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 이메일 인증 처리
    try {
      user.verifyEmail();
    } catch (error) {
      throw new ValidationException(error.message);
    }

    // 업데이트 저장
    await this.userRepository.update(user);

    // 환영 이메일 발송 (비동기 처리)
    this.emailService
      .sendWelcomeEmail(user.getEmail(), user.getNickname())
      .catch((error) => {
        console.error('Failed to send welcome email:', error);
      });

    return {
      success: true,
      message: '이메일 인증이 완료되었습니다.',
    };
  }
}