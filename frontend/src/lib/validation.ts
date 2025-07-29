// 폼 검증 유틸리티

export interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: T) => string | null;
  message?: string;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// 개별 필드 검증
export function validateField(value: unknown, rules: ValidationRule): string | null {
  // Required 검증
  if (rules.required && (value === undefined || value === null || value === '')) {
    return rules.message || '필수 입력 항목입니다.';
  }

  // 값이 없으면 다른 검증은 스킵
  if (value === undefined || value === null || value === '') {
    return null;
  }

  // 문자열 길이 검증
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return rules.message || `최소 ${rules.minLength}자 이상 입력해주세요.`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.message || `최대 ${rules.maxLength}자까지 입력 가능합니다.`;
    }
  }

  // 숫자 범위 검증
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return rules.message || `${rules.min} 이상의 값을 입력해주세요.`;
    }
    if (rules.max !== undefined && value > rules.max) {
      return rules.message || `${rules.max} 이하의 값을 입력해주세요.`;
    }
  }

  // 패턴 검증
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return rules.message || '올바른 형식으로 입력해주세요.';
  }

  // 커스텀 검증
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
}

// 폼 전체 검증
export function validateFormData(data: Record<string, unknown>, rules: ValidationRules): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const error = validateField(data[fieldName], fieldRules);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// 공통 검증 규칙들
export const commonValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '올바른 이메일 주소를 입력해주세요.'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: '비밀번호는 8자 이상이며, 대소문자, 숫자, 특수문자를 포함해야 합니다.'
  },
  phone: {
    pattern: /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/,
    message: '올바른 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)'
  },
  url: {
    pattern: /^https?:\/\/.+/,
    message: '올바른 URL을 입력해주세요. (http:// 또는 https://로 시작)'
  },
  koreanName: {
    pattern: /^[가-힣]{2,10}$/,
    message: '한글 이름을 2-10자로 입력해주세요.'
  },
  username: {
    pattern: /^[a-zA-Z0-9_]{3,20}$/,
    message: '사용자명은 3-20자의 영문, 숫자, 밑줄(_)만 사용 가능합니다.'
  }
};

// 특정 검증 함수들
export const validators = {
  required: (message?: string): ValidationRule => ({
    required: true,
    message: message || '필수 입력 항목입니다.'
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message: message || `최소 ${length}자 이상 입력해주세요.`
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message: message || `최대 ${length}자까지 입력 가능합니다.`
  }),

  email: (message?: string): ValidationRule => ({
    ...commonValidationRules.email,
    message: message || commonValidationRules.email.message
  }),

  password: (message?: string): ValidationRule => ({
    ...commonValidationRules.password,
    message: message || commonValidationRules.password.message
  }),

  range: (min: number, max: number, message?: string): ValidationRule => ({
    min,
    max,
    message: message || `${min}부터 ${max} 사이의 값을 입력해주세요.`
  })
};

// 개별 검증 함수들
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return commonValidationRules.email.pattern.test(email);
}

export function validatePassword(password: string): { isValid: boolean; errors?: string[]; error?: string } {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: '비밀번호를 입력해주세요' };
  }

  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('비밀번호는 8자 이상이어야 합니다');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다');
  }
  if (!/\d/.test(password)) {
    errors.push('숫자를 포함해야 합니다');
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    error: errors.length > 0 ? errors[0] : undefined
  };
}

export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (!username || typeof username !== 'string') {
    return { isValid: false, error: '사용자명을 입력해주세요' };
  }

  if (username.length < 3) {
    return { isValid: false, error: '사용자명은 3자 이상이어야 합니다' };
  }
  if (username.length > 20) {
    return { isValid: false, error: '사용자명은 20자 이하여야 합니다' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: '사용자명은 영문자, 숫자, 밑줄(_)만 사용 가능합니다' };
  }

  return { isValid: true };
}