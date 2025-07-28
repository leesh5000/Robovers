import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { EmailService } from '../../domain/services/email.service.interface';
import { EmailVerificationTokenService } from '@/modules/auth/domain/services/email-verification-token.service';
import { TokenStorageService } from '@/modules/auth/infrastructure/redis/token-storage.service';
import { EmailRateLimiterService } from '@/modules/auth/infrastructure/rate-limit/email-rate-limiter.service';
import { Email } from '../../domain/value-objects/email.vo';
import {
  NotFoundException,
  ValidationException,
} from '@/common/exceptions/app.exception';
import {
  USER_REPOSITORY_TOKEN,
  EMAIL_SERVICE_TOKEN,
} from '../../infrastructure/di-tokens';

export interface ResendVerificationCommandInput {
  email: string;
}

export interface ResendVerificationCommandOutput {
  message: string;
}

@Injectable()
export class ResendVerificationCommand {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(EMAIL_SERVICE_TOKEN)
    private readonly emailService: EmailService,
    private readonly emailVerificationTokenService: EmailVerificationTokenService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly emailRateLimiterService: EmailRateLimiterService,
  ) {}

  async execute(
    input: ResendVerificationCommandInput,
  ): Promise<ResendVerificationCommandOutput> {
    // 이메일 유효성 검증
    const emailVo = new Email(input.email);
    const email = emailVo.getValue();

    // 사용자 조회
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 이미 인증된 경우
    if (user.isEmailVerified()) {
      throw new ValidationException('이미 이메일 인증이 완료된 계정입니다.');
    }

    // Rate limit 확인
    const rateLimitResult = await this.emailRateLimiterService.checkRateLimit(
      email,
      'verification',
    );

    if (!rateLimitResult.allowed) {
      throw new ValidationException(
        `이메일 발송 제한에 걸렸습니다. ${rateLimitResult.retryAfter}초 후에 다시 시도해주세요.`,
      );
    }

    // 6자리 인증 코드 생성
    const verificationCode =
      await this.emailVerificationTokenService.generateVerificationCode();

    // Redis에 코드 저장 (1시간 유효)
    await this.tokenStorageService.saveEmailVerificationToken(
      email,
      verificationCode,
      3600,
    );

    // 이메일 발송
    const sent = await this.emailService.sendVerificationEmail(
      email,
      verificationCode,
    );

    if (!sent) {
      // Rate limit 초기화 (실패한 경우)
      await this.emailRateLimiterService.resetRateLimit(email, 'verification');
      throw new ValidationException(
        '이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    }

    return {
      message: '인증 이메일을 다시 보냈습니다.',
    };
  }
}
