import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { UserRepositoryInterface, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { PasswordServiceInterface, PASSWORD_SERVICE_TOKEN } from '../services/password.service.interface';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(PASSWORD_SERVICE_TOKEN)
    private readonly passwordService: PasswordServiceInterface,
  ) {}

  async execute(
    email: string,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ): Promise<User> {
    // Create value objects (validation happens here)
    const emailVO = Email.create(email);
    const usernameVO = Username.create(username);
    const passwordVO = Password.create(password);

    // Check if email already exists
    const existingUserByEmail = await this.userRepository.findByEmail(emailVO.value);
    if (existingUserByEmail) {
      throw new UserAlreadyExistsException('email', emailVO.value);
    }

    // Check if username already exists
    const existingUserByUsername = await this.userRepository.findByUsername(usernameVO.value);
    if (existingUserByUsername) {
      throw new UserAlreadyExistsException('username', usernameVO.value);
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(passwordVO.value);
    const hashedPasswordVO = Password.fromHash(hashedPassword);

    // Create user
    const user = User.create({
      email: emailVO,
      username: usernameVO,
      password: hashedPasswordVO,
      firstName,
      lastName,
    });

    // Save user
    return await this.userRepository.save(user);
  }
}