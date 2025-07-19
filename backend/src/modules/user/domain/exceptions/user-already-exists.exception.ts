export class UserAlreadyExistsException extends Error {
  constructor(field: 'email' | 'username', value: string) {
    super(`User with ${field} '${value}' already exists`);
    this.name = 'UserAlreadyExistsException';
  }
}