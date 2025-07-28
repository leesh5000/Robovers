import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { EmailService } from '../../domain/services/email.service.interface';
import { EmailVerificationTokenService } from '@/modules/auth/domain/services/email-verification-token.service';
import { TokenStorageService } from '@/modules/auth/infrastructure/redis/token-storage.service';
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
  code: string;
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
    private readonly emailVerificationTokenService: EmailVerificationTokenService,
    private readonly tokenStorageService: TokenStorageService,
  ) {}

  async execute(
    input: VerifyEmailCommandInput,
  ): Promise<VerifyEmailCommandOutput> {
    const { email, code } = input;

    // Redis에서 저장된 코드 확인
    const storedCode =
      await this.tokenStorageService.getEmailVerificationToken(email);
    if (!storedCode) {
      throw new ValidationException(
        '인증 코드가 만료되었거나 존재하지 않습니다.',
      );
    }

    // 코드 검증
    const verificationResult =
      await this.emailVerificationTokenService.verifyCode(
        email,
        code,
        storedCode,
      );

    if (!verificationResult.isValid) {
      throw new ValidationException('유효하지 않은 인증 코드입니다.');
    }

    // 사용자 조회
    const user = await this.userRepository.findByEmail(email);
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

    // Redis에서 코드 삭제
    await this.tokenStorageService.deleteEmailVerificationToken(email);

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
