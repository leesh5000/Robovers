import { User, UserRole } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { Nickname } from '../value-objects/nickname.vo';

export interface CreateUserProps {
  email: Email;
  password: Password;
  nickname: Nickname;
  profileImageUrl?: string;
  bio?: string;
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
}

export interface UserFactoryInterface {
  create(props: CreateUserProps): User;
  
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
  }): User;
}

export const USER_FACTORY_TOKEN = Symbol('UserFactory');