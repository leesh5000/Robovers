import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { Nickname } from '../../domain/value-objects/nickname.vo';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { UserRepositoryInterface, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { PasswordServiceInterface, PASSWORD_SERVICE_TOKEN } from '../services/password.service.interface';
import { UserFactoryInterface, USER_FACTORY_TOKEN } from '../../domain/factories/user.factory.interface';
import { SendVerificationEmailUseCase } from './send-verification-email.use-case';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(PASSWORD_SERVICE_TOKEN)
    private readonly passwordService: PasswordServiceInterface,
    @Inject(USER_FACTORY_TOKEN)
    private readonly userFactory: UserFactoryInterface,
    private readonly sendVerificationEmailUseCase: SendVerificationEmailUseCase,
  ) {}

  async execute(
    email: string,
    password: string,
    nickname: string,
  ): Promise<User> {
    // Create value objects (validation happens here)
    const emailVO = Email.create(email);
    const passwordVO = Password.create(password);
    const nicknameVO = Nickname.create(nickname);

    // Check if email already exists
    const existingUserByEmail = await this.userRepository.findByEmail(emailVO.value);
    if (existingUserByEmail) {
      throw new UserAlreadyExistsException('email', emailVO.value);
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(passwordVO.value);
    const hashedPasswordVO = Password.fromHash(hashedPassword);

    // Create user with factory (emailVerified is false by default)
    const user = this.userFactory.create({
      email: emailVO,
      password: hashedPasswordVO,
      nickname: nicknameVO,
      emailVerified: false, // Explicitly set to false
    });

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Send verification email
    try {
      await this.sendVerificationEmailUseCase.execute(emailVO.value);
    } catch (error) {
      // Log error but don't fail registration if email service is not configured
      console.warn('Failed to send verification email:', error.message);
    }

    return savedUser;
  }
}