import { User, UserRole } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { Nickname } from '../../domain/value-objects/nickname.vo';
import { UserFactoryInterface, CreateUserProps } from '../../domain/factories/user.factory.interface';
import { FakeSnowflakeIdService } from './fake-snowflake-id.service';

export class FakeUserFactory implements UserFactoryInterface {
  private snowflakeIdService: FakeSnowflakeIdService;

  constructor() {
    this.snowflakeIdService = new FakeSnowflakeIdService();
  }

  create(props: CreateUserProps): User {
    const id = this.snowflakeIdService.generateId();
    return User.create({
      id,
      ...props,
    });
  }

  createWithId(id: string, props: CreateUserProps): User {
    return User.create({
      id,
      ...props,
    });
  }

  reconstitute(data: {
    id: string;
    email: string;
    password: string;
    nickname: string;
    bio?: string | null;
    profileImageUrl?: string | null;
    role: UserRole;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.create({
      id: data.id,
      email: Email.create(data.email),
      password: Password.fromHash(data.password),
      nickname: Nickname.create(data.nickname),
      bio: data.bio ?? undefined,
      profileImageUrl: data.profileImageUrl ?? undefined,
      role: data.role,
      isActive: data.isActive,
      emailVerified: data.emailVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  reset(): void {
    this.snowflakeIdService.reset();
  }
}