import { Injectable } from '@nestjs/common';
import { SnowflakeIdService } from '@/common/snowflake/snowflake-id.service';
import { User, UserRole } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { Nickname } from '../value-objects/nickname.vo';
import { UserFactoryInterface, CreateUserProps } from './user.factory.interface';

@Injectable()
export class UserFactory implements UserFactoryInterface {
  constructor(private readonly snowflakeIdService: SnowflakeIdService) {}

  create(props: CreateUserProps): User {
    const id = this.snowflakeIdService.generateId();
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
    profileImageUrl?: string;
    bio?: string;
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
      profileImageUrl: data.profileImageUrl,
      bio: data.bio,
      role: data.role,
      isActive: data.isActive,
      emailVerified: data.emailVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}