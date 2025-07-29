import { Injectable, Inject } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { PasswordHashService } from '../../domain/services/password-hash.service.interface';
import { EmailService } from '../../domain/services/email.service.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { Nickname } from '../../domain/value-objects/nickname.vo';
import { ConflictException } from '@/common/exceptions/app.exception';
import { EmailVerificationTokenService } from '@/modules/auth/domain/services/email-verification-token.service';
import { TokenStorageService } from '@/modules/auth/infrastructure/redis/token-storage.service';
import { EmailRateLimiterService } from '@/modules/auth/infrastructure/rate-limit/email-rate-limiter.service';
import {
  USER_REPOSITORY_TOKEN,
  PASSWORD_HASH_SERVICE_TOKEN,
  EMAIL_SERVICE_TOKEN,
} from '../../infrastructure/di-tokens';

export interface RegisterUserCommandInput {
  email: string;
  password: string;
  nickname: string;
}

export interface RegisterUserCommandOutput {
  id: string;
  email: string;
  nickname: string;
}

@Injectable()
export class RegisterUserCommand {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASH_SERVICE_TOKEN)
    private readonly passwordHashService: PasswordHashService,
    @Inject(EMAIL_SERVICE_TOKEN)
    private readonly emailService: EmailService,
    private readonly emailVerificationTokenService: EmailVerificationTokenService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly emailRateLimiterService: EmailRateLimiterService,
  ) {}

  async execute(
    input: RegisterUserCommandInput,
  ): Promise<RegisterUserCommandOutput> {
    // 값 객체 생성을 통한 유효성 검증
    const emailVo = new Email(input.email);
    const passwordVo = new Password(input.password);
    const nicknameVo = new Nickname(input.nickname);

    // 이메일 중복 확인
    const emailExists = await this.userRepository.existsByEmail(
      emailVo.getValue(),
    );
    if (emailExists) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 닉네임 중복 확인
    const nicknameExists = await this.userRepository.existsByNickname(
      nicknameVo.getValue(),
    );
    if (nicknameExists) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await this.passwordHashService.hash(
      passwordVo.getValue(),
    );

    // 사용자 엔티티 생성
    const user = UserEntity.create({
      email: emailVo.getValue(),
      password: hashedPassword,
      nickname: nicknameVo.getValue(),
    });

    // 사용자 저장
    const savedUser = await this.userRepository.save(user);

    // 이메일 인증 메일 발송 (비동기 처리, 실패해도 회원가입은 성공)
    this.sendVerificationEmail(savedUser.getEmail()).catch((error) => {
      console.error('Failed to send verification email:', error);
    });

    return {
      id: savedUser.getId(),
      email: savedUser.getEmail(),
      nickname: savedUser.getNickname(),
    };
  }

  private async sendVerificationEmail(email: string): Promise<void> {
    // Rate limit 확인
    const rateLimitResult = await this.emailRateLimiterService.checkRateLimit(
      email,
      'verification',
    );

    if (!rateLimitResult.allowed) {
      console.warn(
        `Rate limit exceeded for email verification: ${email}. Retry after ${rateLimitResult.retryAfter} seconds`,
      );
      return;
    }

    // 6자리 인증 코드 생성
    const verificationCode =
      await this.emailVerificationTokenService.generateVerificationCode();

    // 이메일 발송 시도
    const sent = await this.emailService.sendVerificationEmail(
      email,
      verificationCode,
    );

    if (sent) {
      // 이메일 발송 성공 시에만 Redis에 코드 저장 (1시간 유효)
      await this.tokenStorageService.saveEmailVerificationToken(
        email,
        verificationCode,
        3600,
      );
    } else {
      console.error(`Failed to send verification email to ${email}`);
      // Rate limit 초기화 (실패한 경우)
      await this.emailRateLimiterService.resetRateLimit(email, 'verification');
    }
  }
}
