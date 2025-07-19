import { randomUUID } from 'crypto';
import { Email } from '../value-objects/email.vo';
import { Username } from '../value-objects/username.vo';
import { Password } from '../value-objects/password.vo';

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

interface UserProps {
  id?: string;
  email: Email;
  username: Username;
  password: Password;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  bio?: string;
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UpdateProfileProps {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageUrl?: string;
}

export class User {
  private _id: string;
  private _email: Email;
  private _username: Username;
  private _password: Password;
  private _firstName?: string;
  private _lastName?: string;
  private _profileImageUrl?: string;
  private _bio?: string;
  private _role: UserRole;
  private _isActive: boolean;
  private _emailVerified: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this._id = props.id || randomUUID();
    this._email = props.email;
    this._username = props.username;
    this._password = props.password;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
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
    if (props.firstName !== undefined) this._firstName = props.firstName;
    if (props.lastName !== undefined) this._lastName = props.lastName;
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

  getFullName(): string {
    const parts = [];
    if (this._firstName) parts.push(this._firstName);
    if (this._lastName) parts.push(this._lastName);
    return parts.join(' ');
  }

  // Getters
  get id(): string { return this._id; }
  get email(): Email { return this._email; }
  get username(): Username { return this._username; }
  get password(): Password { return this._password; }
  get firstName(): string | undefined { return this._firstName; }
  get lastName(): string | undefined { return this._lastName; }
  get profileImageUrl(): string | undefined { return this._profileImageUrl; }
  get bio(): string | undefined { return this._bio; }
  get role(): UserRole { return this._role; }
  get isActive(): boolean { return this._isActive; }
  get emailVerified(): boolean { return this._emailVerified; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
}