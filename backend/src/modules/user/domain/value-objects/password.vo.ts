export class Password {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error(
        '비밀번호는 최소 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.',
      );
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  private isValid(password: string): boolean {
    // 최소 8자, 영문, 숫자, 특수문자 포함
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  }

  toString(): string {
    return '[PROTECTED]';
  }
}