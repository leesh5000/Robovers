import { Injectable, Inject } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { PasswordHashService } from '../../domain/services/password-hash.service.interface';
import { EmailService } from '../../domain/services/email.service.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { Nickname } from '../../domain/value-objects/nickname.vo';
import { ConflictException } from '@/common/exceptions/app.exception';
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
    // TODO: 실제 토큰 생성 로직 구현
    const verificationToken = 'temp-verification-token';
    await this.emailService.sendVerificationEmail(email, verificationToken);
  }
}