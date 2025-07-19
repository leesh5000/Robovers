export class Nickname {
  private readonly MIN_LENGTH = 2;
  private readonly MAX_LENGTH = 20;
  private readonly VALID_PATTERN = /^[a-zA-Z0-9_-]{2,20}$/;

  constructor(private readonly value: string) {
    this.validate(value);
  }

  private validate(nickname: string): void {
    if (!nickname) {
      throw new Error('Nickname is required');
    }

    if (nickname.length < this.MIN_LENGTH) {
      throw new Error(`Nickname must be at least ${this.MIN_LENGTH} characters long`);
    }

    if (nickname.length > this.MAX_LENGTH) {
      throw new Error(`Nickname must be no more than ${this.MAX_LENGTH} characters long`);
    }

    if (!this.VALID_PATTERN.test(nickname)) {
      throw new Error('Nickname can only contain letters, numbers, hyphens, and underscores');
    }
  }

  static create(nickname: string): Nickname {
    return new Nickname(nickname);
  }

  get getValue(): string {
    return this.value;
  }

  equals(other: Nickname): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}