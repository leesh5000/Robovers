import { Inject, Injectable } from '@nestjs/common';
import { 
  EmailVerificationRepositoryInterface, 
  EMAIL_VERIFICATION_REPOSITORY_TOKEN 
} from '../../domain/repositories/email-verification.repository.interface';
import { 
  UserRepositoryInterface, 
  USER_REPOSITORY_TOKEN 
} from '../../domain/repositories/user.repository.interface';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(EMAIL_VERIFICATION_REPOSITORY_TOKEN)
    private readonly emailVerificationRepository: EmailVerificationRepositoryInterface,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(email: string, code: string): Promise<void> {
    // Find verification record
    const verification = await this.emailVerificationRepository.findByEmail(email);
    
    if (!verification) {
      throw new Error('Verification code not found');
    }

    // Verify the code (will throw if expired or max attempts exceeded)
    const isValid = verification.verify(code);

    if (!isValid) {
      // Save updated attempts count
      await this.emailVerificationRepository.save(verification);
      throw new Error('Invalid verification code');
    }

    // Find and update user
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Mark email as verified
    user.verifyEmail();
    await this.userRepository.save(user);

    // Delete verification record
    await this.emailVerificationRepository.deleteByEmail(email);
  }
}