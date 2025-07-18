// 이메일 유효성 검사
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 강도 검사
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('비밀번호는 8자 이상이어야 합니다');
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('영문자를 포함해야 합니다');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 포함해야 합니다');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 비밀번호 강도 레벨
export const getPasswordStrength = (password: string): {
  level: 'weak' | 'medium' | 'strong';
  percentage: number;
  color: string;
} => {
  let strength = 0;
  
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 10;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
  
  if (strength <= 40) {
    return { level: 'weak', percentage: strength, color: 'bg-red-500' };
  } else if (strength <= 70) {
    return { level: 'medium', percentage: strength, color: 'bg-yellow-500' };
  } else {
    return { level: 'strong', percentage: strength, color: 'bg-green-500' };
  }
};

// 사용자명 유효성 검사
export const validateUsername = (username: string): {
  isValid: boolean;
  error?: string;
} => {
  if (username.length < 2) {
    return { isValid: false, error: '사용자명은 2자 이상이어야 합니다' };
  }
  
  if (username.length > 20) {
    return { isValid: false, error: '사용자명은 20자 이하여야 합니다' };
  }
  
  if (!/^[a-zA-Z0-9가-힣_]+$/.test(username)) {
    return { isValid: false, error: '사용자명은 영문, 한글, 숫자, 언더스코어만 사용 가능합니다' };
  }
  
  return { isValid: true };
};