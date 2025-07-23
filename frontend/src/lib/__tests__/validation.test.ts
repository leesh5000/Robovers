import {
  validateField,
  validateFormData,
  validators,
  commonValidationRules,
  ValidationRule,
} from '../validation';

describe('validateField', () => {
  describe('required validation', () => {
    const requiredRule: ValidationRule = { required: true };

    it('should return error for empty values', () => {
      expect(validateField('', requiredRule)).toBe('필수 입력 항목입니다.');
      expect(validateField(null, requiredRule)).toBe('필수 입력 항목입니다.');
      expect(validateField(undefined, requiredRule)).toBe('필수 입력 항목입니다.');
    });

    it('should return null for non-empty values', () => {
      expect(validateField('hello', requiredRule)).toBeNull();
      expect(validateField(0, requiredRule)).toBeNull();
      expect(validateField(false, requiredRule)).toBeNull();
    });

    it('should use custom error message', () => {
      const customRule: ValidationRule = { required: true, message: '이 필드는 필수입니다.' };
      expect(validateField('', customRule)).toBe('이 필드는 필수입니다.');
    });
  });

  describe('string length validation', () => {
    it('should validate minimum length', () => {
      const rule: ValidationRule = { minLength: 5 };
      expect(validateField('abc', rule)).toBe('최소 5자 이상 입력해주세요.');
      expect(validateField('abcdef', rule)).toBeNull();
    });

    it('should validate maximum length', () => {
      const rule: ValidationRule = { maxLength: 5 };
      expect(validateField('abcdef', rule)).toBe('최대 5자까지 입력 가능합니다.');
      expect(validateField('abc', rule)).toBeNull();
    });

    it('should skip validation for empty values when not required', () => {
      const rule: ValidationRule = { minLength: 5, maxLength: 10 };
      expect(validateField('', rule)).toBeNull();
      expect(validateField(null, rule)).toBeNull();
    });
  });

  describe('number range validation', () => {
    it('should validate minimum value', () => {
      const rule: ValidationRule = { min: 10 };
      expect(validateField(5, rule)).toBe('10 이상의 값을 입력해주세요.');
      expect(validateField(15, rule)).toBeNull();
    });

    it('should validate maximum value', () => {
      const rule: ValidationRule = { max: 100 };
      expect(validateField(150, rule)).toBe('100 이하의 값을 입력해주세요.');
      expect(validateField(50, rule)).toBeNull();
    });
  });

  describe('pattern validation', () => {
    it('should validate against regex pattern', () => {
      const emailRule: ValidationRule = { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ };
      expect(validateField('invalid-email', emailRule)).toBe('올바른 형식으로 입력해주세요.');
      expect(validateField('test@example.com', emailRule)).toBeNull();
    });
  });

  describe('custom validation', () => {
    it('should use custom validation function', () => {
      const rule: ValidationRule = {
        custom: (value: string) => {
          if (value === 'forbidden') {
            return '금지된 값입니다.';
          }
          return null;
        }
      };

      expect(validateField('forbidden', rule)).toBe('금지된 값입니다.');
      expect(validateField('allowed', rule)).toBeNull();
    });
  });
});

describe('validateFormData', () => {
  it('should validate entire form', () => {
    const formData = {
      email: 'invalid-email',
      password: '123',
      name: '',
      age: 150
    };

    const rules = {
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      password: { required: true, minLength: 8 },
      name: { required: true },
      age: { min: 0, max: 120 }
    };

    const result = validateFormData(formData, rules);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('password');
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('age');
  });

  it('should return valid result for correct data', () => {
    const formData = {
      email: 'test@example.com',
      password: 'StrongPassword123!',
      name: 'John Doe',
      age: 25
    };

    const rules = {
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      password: { required: true, minLength: 8 },
      name: { required: true },
      age: { min: 0, max: 120 }
    };

    const result = validateFormData(formData, rules);

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});

describe('commonValidationRules', () => {
  describe('email', () => {
    it('should validate email addresses', () => {
      const rule = commonValidationRules.email;
      expect(validateField('test@example.com', rule)).toBeNull();
      expect(validateField('invalid-email', rule)).toBe('올바른 이메일 주소를 입력해주세요.');
    });
  });

  describe('password', () => {
    it('should validate password strength', () => {
      const rule = commonValidationRules.password;
      expect(validateField('WeakPassword', rule)).toBe('비밀번호는 8자 이상이며, 대소문자, 숫자, 특수문자를 포함해야 합니다.');
      expect(validateField('StrongPassword123!', rule)).toBeNull();
    });
  });

  describe('phone', () => {
    it('should validate Korean phone numbers', () => {
      const rule = commonValidationRules.phone;
      expect(validateField('010-1234-5678', rule)).toBeNull();
      expect(validateField('01012345678', rule)).toBeNull();
      expect(validateField('invalid-phone', rule)).toBe('올바른 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)');
    });
  });

  describe('url', () => {
    it('should validate URLs', () => {
      const rule = commonValidationRules.url;
      expect(validateField('https://example.com', rule)).toBeNull();
      expect(validateField('http://test.co.kr', rule)).toBeNull();
      expect(validateField('invalid-url', rule)).toBe('올바른 URL을 입력해주세요. (http:// 또는 https://로 시작)');
    });
  });

  describe('koreanName', () => {
    it('should validate Korean names', () => {
      const rule = commonValidationRules.koreanName;
      expect(validateField('김철수', rule)).toBeNull();
      expect(validateField('홍길동영웅전설', rule)).toBeNull();
      expect(validateField('김', rule)).toBe('한글 이름을 2-10자로 입력해주세요.');
      expect(validateField('John', rule)).toBe('한글 이름을 2-10자로 입력해주세요.');
    });
  });

  describe('username', () => {
    it('should validate usernames', () => {
      const rule = commonValidationRules.username;
      expect(validateField('user123', rule)).toBeNull();
      expect(validateField('test_user', rule)).toBeNull();
      expect(validateField('u', rule)).toBe('사용자명은 3-20자의 영문, 숫자, 밑줄(_)만 사용 가능합니다.');
      expect(validateField('user@domain', rule)).toBe('사용자명은 3-20자의 영문, 숫자, 밑줄(_)만 사용 가능합니다.');
    });
  });
});

describe('validators', () => {
  describe('required', () => {
    it('should create required validation rule', () => {
      const rule = validators.required();
      expect(rule.required).toBe(true);
      expect(rule.message).toBe('필수 입력 항목입니다.');
    });

    it('should use custom message', () => {
      const rule = validators.required('커스텀 메시지');
      expect(rule.message).toBe('커스텀 메시지');
    });
  });

  describe('minLength', () => {
    it('should create min length validation rule', () => {
      const rule = validators.minLength(5);
      expect(rule.minLength).toBe(5);
      expect(rule.message).toBe('최소 5자 이상 입력해주세요.');
    });
  });

  describe('maxLength', () => {
    it('should create max length validation rule', () => {
      const rule = validators.maxLength(10);
      expect(rule.maxLength).toBe(10);
      expect(rule.message).toBe('최대 10자까지 입력 가능합니다.');
    });
  });

  describe('email', () => {
    it('should create email validation rule', () => {
      const rule = validators.email();
      expect(rule.pattern).toEqual(commonValidationRules.email.pattern);
      expect(rule.message).toBe(commonValidationRules.email.message);
    });
  });

  describe('password', () => {
    it('should create password validation rule', () => {
      const rule = validators.password();
      expect(rule.pattern).toEqual(commonValidationRules.password.pattern);
      expect(rule.minLength).toBe(commonValidationRules.password.minLength);
    });
  });

  describe('range', () => {
    it('should create range validation rule', () => {
      const rule = validators.range(1, 100);
      expect(rule.min).toBe(1);
      expect(rule.max).toBe(100);
      expect(rule.message).toBe('1부터 100 사이의 값을 입력해주세요.');
    });
  });
});