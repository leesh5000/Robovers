export class Email {
  private constructor(private readonly email: string) {}

  static create(email: string): Email {
    if (!email) {
      throw new Error('Invalid email format');
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    
    if (!normalizedEmail) {
      throw new Error('Invalid email format');
    }

    // Basic email validation
    const parts = normalizedEmail.split('@');
    if (parts.length !== 2) {
      throw new Error('Invalid email format');
    }

    const [localPart, domainPart] = parts;
    
    // Validate local part
    if (!localPart || localPart.includes('..') || localPart.startsWith('.') || localPart.endsWith('.')) {
      throw new Error('Invalid email format');
    }

    // Validate domain part
    if (!domainPart || !domainPart.includes('.')) {
      throw new Error('Invalid email format');
    }

    const domainParts = domainPart.split('.');
    if (domainParts.some(part => !part) || domainParts[domainParts.length - 1].length < 2) {
      throw new Error('Invalid email format');
    }

    // Final regex check for allowed characters
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      throw new Error('Invalid email format');
    }

    return new Email(normalizedEmail);
  }

  get value(): string {
    return this.email;
  }

  equals(other: Email): boolean {
    return this.email === other.email;
  }

  toString(): string {
    return this.email;
  }
}