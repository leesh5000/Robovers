export class Nickname {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error(
        '닉네임은 2-20자의 한글, 영문, 숫자만 사용할 수 있습니다.',
      );
    }
    this.value = value.trim();
  }

  getValue(): string {
    return this.value;
  }

  private isValid(nickname: string): boolean {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      return false;
    }
    // 한글, 영문, 숫자만 허용
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
    return nicknameRegex.test(trimmed);
  }

  equals(other: Nickname): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}