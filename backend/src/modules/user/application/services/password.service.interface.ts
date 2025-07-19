export interface PasswordServiceInterface {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

export const PASSWORD_SERVICE_TOKEN = Symbol('PasswordServiceInterface');