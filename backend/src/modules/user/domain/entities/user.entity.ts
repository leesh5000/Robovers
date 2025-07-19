import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { Nickname } from '../value-objects/nickname.vo';

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

interface UserProps {
  id: string; // Now required
  email: Email;
  password: Password;
  nickname: Nickname;
  profileImageUrl?: string;
  bio?: string;
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UpdateProfileProps {
  nickname?: Nickname;
  bio?: string;
  profileImageUrl?: string;
}

export class User {
  private _id: string;
  private _email: Email;
  private _password: Password;
  private _nickname: Nickname;
  private _profileImageUrl?: string;
  private _bio?: string;
  private _role: UserRole;
  private _isActive: boolean;
  private _emailVerified: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._email = props.email;
    this._password = props.password;
    this._nickname = props.nickname;
    this._profileImageUrl = props.profileImageUrl;
    this._bio = props.bio;
    this._role = props.role || UserRole.USER;
    this._isActive = props.isActive ?? true;
    this._emailVerified = props.emailVerified ?? false;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  static create(props: UserProps): User {
    return new User(props);
  }

  updateProfile(props: UpdateProfileProps): void {
    if (props.nickname !== undefined) this._nickname = props.nickname;
    if (props.bio !== undefined) this._bio = props.bio;
    if (props.profileImageUrl !== undefined) this._profileImageUrl = props.profileImageUrl;
    
    this._updatedAt = new Date();
  }

  changePassword(newPassword: Password): void {
    this._password = newPassword;
    this._updatedAt = new Date();
  }

  verifyEmail(): void {
    this._emailVerified = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  changeRole(newRole: UserRole): void {
    this._role = newRole;
    this._updatedAt = new Date();
  }

  getDisplayName(): string {
    return this._nickname.getValue;
  }

  // Getters
  get id(): string { return this._id; }
  get email(): Email { return this._email; }
  get password(): Password { return this._password; }
  get nickname(): Nickname { return this._nickname; }
  get profileImageUrl(): string | undefined { return this._profileImageUrl; }
  get bio(): string | undefined { return this._bio; }
  get role(): UserRole { return this._role; }
  get isActive(): boolean { return this._isActive; }
  get emailVerified(): boolean { return this._emailVerified; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
}