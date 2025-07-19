import { Inject, Injectable } from '@nestjs/common';
import { Email } from '../../domain/value-objects/email.vo';
import { EmailVerification } from '../../domain/entities/email-verification.entity';
import { 
  EmailVerificationRepositoryInterface, 
  EMAIL_VERIFICATION_REPOSITORY_TOKEN 
} from '../../domain/repositories/email-verification.repository.interface';
import { 
  EmailVerificationFactoryInterface,
  EMAIL_VERIFICATION_FACTORY_TOKEN
} from '../../domain/factories/email-verification.factory';
import { EmailServiceInterface, EMAIL_SERVICE_TOKEN } from '../services/email.service.interface';

@Injectable()
export class SendVerificationEmailUseCase {
  private static readonly RESEND_COOLDOWN_MS = 60000; // 1 minute

  constructor(
    @Inject(EMAIL_VERIFICATION_REPOSITORY_TOKEN)
    private readonly emailVerificationRepository: EmailVerificationRepositoryInterface,
    @Inject(EMAIL_VERIFICATION_FACTORY_TOKEN)
    private readonly emailVerificationFactory: EmailVerificationFactoryInterface,
    @Inject(EMAIL_SERVICE_TOKEN)
    private readonly emailService: EmailServiceInterface,
  ) {}

  async execute(email: string): Promise<void> {
    const emailVO = Email.create(email);

    // Check if there's an existing verification
    const existingVerification = await this.emailVerificationRepository.findByEmail(emailVO.value);

    if (existingVerification && !existingVerification.isExpired()) {
      // Check cooldown period (1 minute between resends)
      const timeSinceCreation = Date.now() - existingVerification.createdAt.getTime();
      if (timeSinceCreation < SendVerificationEmailUseCase.RESEND_COOLDOWN_MS) {
        const remainingTime = Math.ceil(
          (SendVerificationEmailUseCase.RESEND_COOLDOWN_MS - timeSinceCreation) / 1000
        );
        throw new Error(`Please wait ${remainingTime} seconds before requesting a new code`);
      }

      // Check if max attempts reached
      if (existingVerification.hasExceededMaxAttempts()) {
        throw new Error('Maximum verification attempts exceeded. Please request a new code');
      }
    }

    // Create new verification
    const verification = this.emailVerificationFactory.create(emailVO);
    
    // Save to repository
    await this.emailVerificationRepository.save(verification);

    // Send email
    await this.emailService.sendVerificationEmail(
      emailVO.value,
      verification.code.value
    );
  }
}